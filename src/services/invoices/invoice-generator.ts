import { getSupabase } from '@/lib/supabase/get-client';

export interface Invoice {
  id: string;
  orderId: string;
  userId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'issued' | 'paid' | 'cancelled';
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export async function generateInvoice(
  orderId: string,
  userId: string,
  items: InvoiceItem[],
  subtotal: number,
  tax: number
): Promise<Invoice> {
  const supabase = await getSupabase();
  
  const total = subtotal + tax;
  const invoiceNumber = `INV-${Date.now()}`;

  const { data, error } = await supabase
    .from('invoices')
    .insert([
      {
        order_id: orderId,
        user_id: userId,
        invoice_number: invoiceNumber,
        items,
        subtotal,
        tax,
        total,
        status: 'draft',
        issue_date: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to generate invoice: ${error.message}`);
  }

  return mapInvoiceFromDb(data);
}

export async function getInvoiceByOrderId(orderId: string): Promise<Invoice | null> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('invoices')
    .select()
    .eq('order_id', orderId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch invoice: ${error.message}`);
  }

  return data ? mapInvoiceFromDb(data) : null;
}

export async function getUserInvoices(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Invoice[]> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('invoices')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch user invoices: ${error.message}`);
  }

  return (data || []).map(mapInvoiceFromDb);
}

export async function markInvoiceAsPaid(invoiceId: string): Promise<Invoice> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'paid',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoiceId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to mark invoice as paid: ${error.message}`);
  }

  return mapInvoiceFromDb(data);
}

export async function cancelInvoice(invoiceId: string): Promise<Invoice> {
  const supabase = await getSupabase();
  
  const { data, error } = await supabase
    .from('invoices')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', invoiceId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to cancel invoice: ${error.message}`);
  }

  return mapInvoiceFromDb(data);
}

function mapInvoiceFromDb(dbInvoice: any): Invoice {
  return {
    id: dbInvoice.id,
    orderId: dbInvoice.order_id,
    userId: dbInvoice.user_id,
    invoiceNumber: dbInvoice.invoice_number,
    issueDate: dbInvoice.issue_date,
    dueDate: dbInvoice.due_date || undefined,
    items: dbInvoice.items || [],
    subtotal: dbInvoice.subtotal,
    tax: dbInvoice.tax,
    total: dbInvoice.total,
    status: dbInvoice.status,
    pdfUrl: dbInvoice.pdf_url || undefined,
    createdAt: dbInvoice.created_at,
    updatedAt: dbInvoice.updated_at,
  };
}
