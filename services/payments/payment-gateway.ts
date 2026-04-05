// D53 — payment-gateway.ts | services/payments/
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { isConfigured } from '@/lib/env';
import { env } from '@/lib/env';

export interface PaymentOrderInput {
  amount: number; // in paise
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentOrder {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  createdAt: number;
}

export interface PaymentVerifyInput {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface RefundInput {
  paymentId: string;
  amount?: number; // partial refund in paise; omit for full
  notes?: Record<string, string>;
}

export interface RefundResult {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentDetails {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  email?: string;
  contact?: string;
  description?: string;
  createdAt: number;
}

function getRazorpayClient(): Razorpay | null {
  try {
    if (!isConfigured('RAZORPAY_KEY_ID') || !isConfigured('RAZORPAY_KEY_SECRET')) {
      console.warn('[payment-gateway] Razorpay keys not configured');
      return null;
    }
    return new Razorpay({
      key_id: env('RAZORPAY_KEY_ID'),
      key_secret: env('RAZORPAY_KEY_SECRET'),
    });
  } catch (err) {
    console.warn('[payment-gateway] getRazorpayClient exception:', err);
    return null;
  }
}

export async function createPaymentOrder(
  input: PaymentOrderInput
): Promise<PaymentOrder | null> {
  try {
    const rzp = getRazorpayClient();
    if (!rzp) return null;

    const order = await rzp.orders.create({
      amount: input.amount,
      currency: input.currency ?? 'INR',
      receipt: input.receipt,
      notes: input.notes ?? {},
    });

    return {
      id: order.id,
      entity: order.entity,
      amount: Number(order.amount),
      currency: order.currency,
      receipt: order.receipt ?? input.receipt,
      status: order.status,
      attempts: order.attempts,
      createdAt: order.created_at,
    };
  } catch (err) {
    console.warn('[payment-gateway] createPaymentOrder exception:', err);
    return null;
  }
}

export function verifyPaymentSignature(input: PaymentVerifyInput): boolean {
  try {
    if (!isConfigured('RAZORPAY_KEY_SECRET')) {
      console.warn('[payment-gateway] RAZORPAY_KEY_SECRET not configured');
      return false;
    }
    const body = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;
    const expected = crypto
      .createHmac('sha256', env('RAZORPAY_KEY_SECRET'))
      .update(body)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(input.razorpaySignature)
    );
  } catch (err) {
    console.warn('[payment-gateway] verifyPaymentSignature exception:', err);
    return false;
  }
}

export async function fetchPaymentDetails(paymentId: string): Promise<PaymentDetails | null> {
  try {
    const rzp = getRazorpayClient();
    if (!rzp) return null;

    const payment = await rzp.payments.fetch(paymentId);

    return {
      id: payment.id,
      orderId: payment.order_id ?? '',
      amount: Number(payment.amount),
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      email: payment.email ?? undefined,
      contact: payment.contact ?? undefined,
      description: payment.description ?? undefined,
      createdAt: payment.created_at,
    };
  } catch (err) {
    console.warn('[payment-gateway] fetchPaymentDetails exception:', err);
    return null;
  }
}

export async function initiateRefund(input: RefundInput): Promise<RefundResult | null> {
  try {
    const rzp = getRazorpayClient();
    if (!rzp) return null;

    const refundData: { amount?: number; notes?: Record<string, string> } = {};
    if (input.amount) refundData.amount = input.amount;
    if (input.notes) refundData.notes = input.notes;

    const refund = await rzp.payments.refund(input.paymentId, refundData);

    return {
      id: refund.id,
      paymentId: refund.payment_id,
      amount: Number(refund.amount),
      currency: refund.currency,
      status: refund.status,
    };
  } catch (err) {
    console.warn('[payment-gateway] initiateRefund exception:', err);
    return null;
  }
}

export async function fetchRefundStatus(
  paymentId: string,
  refundId: string
): Promise<RefundResult | null> {
  try {
    const rzp = getRazorpayClient();
    if (!rzp) return null;

    const refund = await rzp.payments.fetchRefund(paymentId, refundId);

    return {
      id: refund.id,
      paymentId: refund.payment_id,
      amount: Number(refund.amount),
      currency: refund.currency,
      status: refund.status,
    };
  } catch (err) {
    console.warn('[payment-gateway] fetchRefundStatus exception:', err);
    return null;
  }
}

export function getRazorpayPublicKey(): string {
  try {
    if (!isConfigured('RAZORPAY_KEY_ID')) {
      console.warn('[payment-gateway] RAZORPAY_KEY_ID not configured');
      return '';
    }
    return env('RAZORPAY_KEY_ID');
  } catch (err) {
    console.warn('[payment-gateway] getRazorpayPublicKey exception:', err);
    return '';
  }
}

export function toRazorpayAmount(inr: number): number {
  return Math.round(inr * 100);
}

export function fromRazorpayAmount(paise: number): number {
  return paise / 100;
}
