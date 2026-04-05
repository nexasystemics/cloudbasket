// D59 — invoice-generator.ts | services/tax/
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isConfigured } from '@/lib/env';

export interface InvoiceItem {
  description: string;
  hsn: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalAmount: number;
}

export interface InvoiceAddress {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  invoiceDate: string;
  billingAddress: InvoiceAddress;
  shippingAddress: InvoiceAddress;
  items: InvoiceItem[];
  subtotal: number;
  totalDiscount: number;
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalTax: number;
  shippingCharge: number;
  grandTotal: number;
  isInterState: boolean;
  sellerGstin: string;
  sellerName: string;
  sellerAddress: string;
  createdAt: string;
}

export interface GenerateInvoiceInput {
  orderId: string;
  userId: string;
}

const SELLER_GSTIN = '27AAAAA0000A1Z5'; // placeholder — replace with real GSTIN
const SELLER_NAME = 'NEXQON HOLDINGS';
const SELLER_ADDRESS = 'Mumbai, Maharashtra, India';

function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const seq = Date.now().toString().slice(-6);
  return `CB-INV-${year}-${seq}`;
}

function isInterStateTransaction(sellerState: string, buyerState: string): boolean {
  return sellerState.toLowerCase() !== buyerState.toLowerCase();
}

function calculateTax(
  taxableAmount: number,
  gstRate: number,
  interState: boolean
): { cgst: number; sgst: number; igst: number } {
  if (interState) {
    return { cgst: 0, sgst: 0, igst: +(taxableAmount * (gstRate / 100)).toFixed(2) };
  }
  const half = +(taxableAmount * (gstRate / 200)).toFixed(2);
  return { cgst: half, sgst: half, igst: 0 };
}

export async function generateInvoice(
  input: GenerateInvoiceInput
): Promise<Invoice | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[invoice-generator] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', input.orderId)
      .eq('user_id', input.userId)
      .single();

    if (orderError || !order) {
      console.warn('[invoice-generator] order fetch error:', orderError?.message);
      return null;
    }

    const { data: existing } = await supabase
      .from('invoices')
      .select('*')
      .eq('order_id', input.orderId)
      .single();

    if (existing) return mapInvoiceRow(existing);

    const shippingState: string = order.shipping_address?.state ?? 'Maharashtra';
    const interState = isInterStateTransaction('Maharashtra', shippingState);

    const invoiceItems: InvoiceItem[] = (order.items ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: Record<string, any>) => {
        const taxableAmount = item.unitPrice * item.quantity - (item.discountAmount ?? 0);
        const gstRate = 18; // default; ideally from product HSN mapping
        const tax = calculateTax(taxableAmount, gstRate, interState);
        return {
          description: item.name,
          hsn: item.hsn ?? '0000',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discountAmount ?? 0,
          taxableAmount,
          cgstRate: interState ? 0 : gstRate / 2,
          cgstAmount: tax.cgst,
          sgstRate: interState ? 0 : gstRate / 2,
          sgstAmount: tax.sgst,
          igstRate: interState ? gstRate : 0,
          igstAmount: tax.igst,
          totalAmount: +(taxableAmount + tax.cgst + tax.sgst + tax.igst).toFixed(2),
        };
      }
    );

    const totalCgst = +invoiceItems.reduce((s, i) => s + i.cgstAmount, 0).toFixed(2);
    const totalSgst = +invoiceItems.reduce((s, i) => s + i.sgstAmount, 0).toFixed(2);
    const totalIgst = +invoiceItems.reduce((s, i) => s + i.igstAmount, 0).toFixed(2);
    const totalTaxableAmount = +invoiceItems.reduce((s, i) => s + i.taxableAmount, 0).toFixed(2);
    const totalDiscount = +invoiceItems.reduce((s, i) => s + i.discount, 0).toFixed(2);

    const invoicePayload = {
      invoice_number: generateInvoiceNumber(),
      order_id: order.id,
      order_number: order.order_number,
      user_id: input.userId,
      invoice_date: new Date().toISOString(),
      billing_address: order.shipping_address,
      shipping_address: order.shipping_address,
      items: invoiceItems,
      subtotal: order.subtotal,
      total_discount: totalDiscount,
      total_taxable_amount: totalTaxableAmount,
      total_cgst: totalCgst,
      total_sgst: totalSgst,
      total_igst: totalIgst,
      total_tax: +(totalCgst + totalSgst + totalIgst).toFixed(2),
      shipping_charge: order.shipping_charge,
      grand_total: order.total_amount,
      is_inter_state: interState,
      seller_gstin: SELLER_GSTIN,
      seller_name: SELLER_NAME,
      seller_address: SELLER_ADDRESS,
    };

    const { data: invoice, error: insertError } = await supabase
      .from('invoices')
      .insert(invoicePayload)
      .select()
      .single();

    if (insertError) {
      console.warn('[invoice-generator] insert error:', insertError.message);
      return null;
    }
    return mapInvoiceRow(invoice);
  } catch (err) {
    console.warn('[invoice-generator] generateInvoice exception:', err);
    return null;
  }
}

export async function getInvoiceByOrder(orderId: string): Promise<Invoice | null> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[invoice-generator] Supabase not configured');
      return null;
    }
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (error) {
      console.warn('[invoice-generator] getInvoiceByOrder error:', error.message);
      return null;
    }
    return mapInvoiceRow(data);
  } catch (err) {
    console.warn('[invoice-generator] getInvoiceByOrder exception:', err);
    return null;
  }
}

export async function getUserInvoices(userId: string): Promise<Invoice[]> {
  try {
    if (!isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
      console.warn('[invoice-generator] Supabase not configured');
      return [];
    }
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[invoice-generator] getUserInvoices error:', error.message);
      return [];
    }
    return (data ?? []).map(mapInvoiceRow);
  } catch (err) {
    console.warn('[invoice-generator] getUserInvoices exception:', err);
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapInvoiceRow(row: Record<string, any>): Invoice {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    orderId: row.order_id,
    orderNumber: row.order_number,
    userId: row.user_id,
    invoiceDate: row.invoice_date,
    billingAddress: row.billing_address,
    shippingAddress: row.shipping_address,
    items: row.items,
    subtotal: row.subtotal,
    totalDiscount: row.total_discount,
    totalTaxableAmount: row.total_taxable_amount,
    totalCgst: row.total_cgst,
    totalSgst: row.total_sgst,
    totalIgst: row.total_igst,
    totalTax: row.total_tax,
    shippingCharge: row.shipping_charge,
    grandTotal: row.grand_total,
    isInterState: row.is_inter_state,
    sellerGstin: row.seller_gstin,
    sellerName: row.seller_name,
    sellerAddress: row.seller_address,
    createdAt: row.created_at,
  };
}
