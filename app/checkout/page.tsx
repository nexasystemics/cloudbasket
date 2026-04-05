// D56 — checkout-page.tsx | app/checkout/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  totalPrice: number;
  imageUrl?: string;
}

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface CheckoutSummary {
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  taxAmount: number;
  walletAmountUsed: number;
  totalAmount: number;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<'address' | 'payment' | 'processing'>('address');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useWallet, setUseWallet] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [summary, setSummary] = useState<CheckoutSummary>({
    subtotal: 0,
    shippingCharge: 0,
    discountAmount: 0,
    taxAmount: 0,
    walletAmountUsed: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayKey, setRazorpayKey] = useState('');

  const fetchCheckoutData = useCallback(async () => {
    try {
      const res = await fetch('/api/checkout/init');
      if (!res.ok) throw new Error('Failed to load checkout');
      const data = await res.json();
      setCartItems(data.cartItems ?? []);
      setAddresses(data.addresses ?? []);
      setWalletBalance(data.walletBalance ?? 0);
      setRazorpayKey(data.razorpayKey ?? '');
      setSummary(data.summary ?? summary);
      if (data.addresses?.length > 0) {
        setSelectedAddressId(data.addresses[0].id);
      }
    } catch (err) {
      console.warn('[checkout-page] fetchCheckoutData:', err);
      setError('Unable to load checkout. Please try again.');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  const recalcSummary = useCallback(
    (applyWallet: boolean) => {
      const walletUsed = applyWallet ? Math.min(walletBalance, summary.totalAmount) : 0;
      setSummary((prev) => ({
        ...prev,
        walletAmountUsed: walletUsed,
        totalAmount: Math.max(0, prev.subtotal + prev.shippingCharge + prev.taxAmount - prev.discountAmount - walletUsed),
      }));
    },
    [walletBalance, summary.totalAmount]
  );

  const handleWalletToggle = (checked: boolean) => {
    setUseWallet(checked);
    recalcSummary(checked);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedAddressId) {
        setError('Please select a delivery address.');
        setLoading(false);
        return;
      }

      const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
      if (!selectedAddress) {
        setError('Invalid address selected.');
        setLoading(false);
        return;
      }

      setStep('payment');

      const orderRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddressId,
          useWallet,
          items: cartItems,
          summary,
        }),
      });

      if (!orderRes.ok) throw new Error('Failed to create order');
      const orderData = await orderRes.json();

      if (summary.totalAmount === 0) {
        router.push(`/account/orders/${orderData.orderId}?status=success`);
        return;
      }

      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: orderData.razorpayAmount,
        currency: 'INR',
        name: 'CloudBasket',
        description: `Order #${orderData.orderNumber}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: selectedAddress.fullName,
          email: orderData.userEmail ?? '',
          contact: selectedAddress.phone,
        },
        theme: { color: '#f97316' },
        handler: async (response: RazorpayResponse) => {
          await handlePaymentSuccess(response, orderData.orderId);
        },
      };

      setStep('processing');
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.warn('[checkout-page] handlePlaceOrder:', err);
      setError('Something went wrong. Please try again.');
      setStep('address');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (
    response: RazorpayResponse,
    orderId: string
  ) => {
    try {
      const verifyRes = await fetch('/api/checkout/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
      });

      if (!verifyRes.ok) throw new Error('Payment verification failed');
      router.push(`/account/orders/${orderId}?status=success`);
    } catch (err) {
      console.warn('[checkout-page] handlePaymentSuccess:', err);
      setError('Payment verified but order update failed. Contact support.');
      setStep('address');
    }
  };

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-800 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
            <div className="w-12" />
          </div>
        </header>

        {/* Steps */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-6">
            {(['address', 'payment', 'processing'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s
                      ? 'bg-orange-500 text-white'
                      : i < ['address', 'payment', 'processing'].indexOf(step)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="text-sm capitalize hidden sm:block">{s}</span>
                {i < 2 && <div className="w-8 h-px bg-gray-300" />}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — Address + Wallet */}
            <div className="lg:col-span-2 space-y-4">
              {/* Addresses */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Delivery Address</h2>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-3">No saved addresses</p>
                    <button
                      onClick={() => router.push('/account/addresses/new?redirect=/checkout')}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                    >
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                          selectedAddressId === addr.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 accent-orange-500"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{addr.fullName}</p>
                          <p className="text-sm text-gray-600">
                            {addr.addressLine1}
                            {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                          </p>
                          <p className="text-sm text-gray-600">
                            {addr.city}, {addr.state} — {addr.pincode}
                          </p>
                          <p className="text-sm text-gray-600">{addr.phone}</p>
                        </div>
                      </label>
                    ))}
                    <button
                      onClick={() => router.push('/account/addresses/new?redirect=/checkout')}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-orange-400 hover:text-orange-500 transition"
                    >
                      + Add New Address
                    </button>
                  </div>
                )}
              </div>

              {/* Wallet */}
              {walletBalance > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-900">CloudBasket Wallet</h2>
                      <p className="text-sm text-gray-500">
                        Available: ₹{walletBalance.toFixed(2)}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => handleWalletToggle(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-orange-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  {useWallet && (
                    <p className="mt-2 text-sm text-green-600">
                      ₹{summary.walletAmountUsed.toFixed(2)} will be deducted from wallet
                    </p>
                  )}
                </div>
              )}

              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h2 className="font-semibold text-gray-900 mb-4">
                  Order Items ({cartItems.length})
                </h2>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">
                        ₹{item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-5 sticky top-24">
                <h2 className="font-semibold text-gray-900 mb-4">Price Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {summary.shippingCharge === 0
                        ? <span className="text-green-600">Free</span>
                        : `₹${summary.shippingCharge.toFixed(2)}`}
                    </span>
                  </div>
                  {summary.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>−₹{summary.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>GST</span>
                    <span>₹{summary.taxAmount.toFixed(2)}</span>
                  </div>
                  {summary.walletAmountUsed > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Wallet</span>
                      <span>−₹{summary.walletAmountUsed.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-900 text-base">
                    <span>Total</span>
                    <span>₹{summary.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || step === 'processing' || !selectedAddressId}
                  className="mt-5 w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading || step === 'processing'
                    ? 'Processing...'
                    : `Pay ₹${summary.totalAmount.toFixed(2)}`}
                </button>

                <p className="mt-3 text-xs text-center text-gray-400">
                  Secured by Razorpay · 256-bit SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
