// D54 — razorpay-webhook.ts | services/payments/
import crypto from 'crypto';
import { isConfigured } from '@/lib/env';
import { env } from '@/lib/env';
import { updateOrderStatus } from '@/services/orders/order-manager';
import { creditWallet } from '@/services/payments/wallet-system';

export type RazorpayEvent =
  | 'payment.authorized'
  | 'payment.captured'
  | 'payment.failed'
  | 'refund.created'
  | 'refund.processed'
  | 'refund.failed'
  | 'order.paid';

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: RazorpayEvent;
  contains: string[];
  payload: {
    payment?: {
      entity: RazorpayPaymentEntity;
    };
    refund?: {
      entity: RazorpayRefundEntity;
    };
    order?: {
      entity: RazorpayOrderEntity;
    };
  };
  created_at: number;
}

export interface RazorpayPaymentEntity {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string | null;
  email: string;
  contact: string;
  notes: Record<string, string>;
  error_code: string | null;
  error_description: string | null;
  created_at: number;
}

export interface RazorpayRefundEntity {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  status: string;
  notes: Record<string, string>;
  receipt: string | null;
  created_at: number;
}

export interface RazorpayOrderEntity {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  notes: Record<string, string>;
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  try {
    if (!isConfigured('RAZORPAY_WEBHOOK_SECRET')) {
      console.warn('[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET not configured');
      return false;
    }
    const expected = crypto
      .createHmac('sha256', env('RAZORPAY_WEBHOOK_SECRET'))
      .update(rawBody)
      .digest('hex');
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch (err) {
    console.warn('[razorpay-webhook] verifyWebhookSignature exception:', err);
    return false;
  }
}

export async function handleWebhookEvent(payload: RazorpayWebhookPayload): Promise<void> {
  try {
    switch (payload.event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;
      case 'refund.processed':
        await handleRefundProcessed(payload);
        break;
      case 'order.paid':
        await handleOrderPaid(payload);
        break;
      default:
        console.warn('[razorpay-webhook] unhandled event:', payload.event);
    }
  } catch (err) {
    console.warn('[razorpay-webhook] handleWebhookEvent exception:', err);
  }
}

async function handlePaymentCaptured(payload: RazorpayWebhookPayload): Promise<void> {
  try {
    const payment = payload.payload.payment?.entity;
    if (!payment) {
      console.warn('[razorpay-webhook] payment.captured: no payment entity');
      return;
    }
    const orderId = payment.notes?.['orderId'];
    if (!orderId) {
      console.warn('[razorpay-webhook] payment.captured: no orderId in notes');
      return;
    }
    await updateOrderStatus(orderId, 'confirmed', {
      paymentId: payment.id,
    });
  } catch (err) {
    console.warn('[razorpay-webhook] handlePaymentCaptured exception:', err);
  }
}

async function handlePaymentFailed(payload: RazorpayWebhookPayload): Promise<void> {
  try {
    const payment = payload.payload.payment?.entity;
    if (!payment) {
      console.warn('[razorpay-webhook] payment.failed: no payment entity');
      return;
    }
    const orderId = payment.notes?.['orderId'];
    if (!orderId) {
      console.warn('[razorpay-webhook] payment.failed: no orderId in notes');
      return;
    }
    await updateOrderStatus(orderId, 'cancelled');
    console.warn(
      `[razorpay-webhook] payment failed: ${payment.error_code} — ${payment.error_description}`
    );
  } catch (err) {
    console.warn('[razorpay-webhook] handlePaymentFailed exception:', err);
  }
}

async function handleRefundProcessed(payload: RazorpayWebhookPayload): Promise<void> {
  try {
    const refund = payload.payload.refund?.entity;
    if (!refund) {
      console.warn('[razorpay-webhook] refund.processed: no refund entity');
      return;
    }
    const orderId = refund.notes?.['orderId'];
    const userId = refund.notes?.['userId'];

    if (orderId) {
      await updateOrderStatus(orderId, 'refunded');
    }
    if (userId) {
      const amountInr = refund.amount / 100;
      await creditWallet({
        userId,
        amount: amountInr,
        description: `Refund for payment ${refund.payment_id}`,
        referenceId: refund.id,
        type: 'refund',
      });
    }
  } catch (err) {
    console.warn('[razorpay-webhook] handleRefundProcessed exception:', err);
  }
}

async function handleOrderPaid(payload: RazorpayWebhookPayload): Promise<void> {
  try {
    const order = payload.payload.order?.entity;
    if (!order) {
      console.warn('[razorpay-webhook] order.paid: no order entity');
      return;
    }
    const orderId = order.notes?.['orderId'];
    if (!orderId) {
      console.warn('[razorpay-webhook] order.paid: no orderId in notes');
      return;
    }
    await updateOrderStatus(orderId, 'confirmed');
  } catch (err) {
    console.warn('[razorpay-webhook] handleOrderPaid exception:', err);
  }
}
