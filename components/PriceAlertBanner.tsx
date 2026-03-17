// Estimated: ~100 lines
// Purpose: Provides a banner for users to subscribe to price alerts via email.

'use client';

import React, { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PriceAlertBanner: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!EMAIL_REGEX.test(email)) {
      setIsValid(false);
      setError("Please enter a valid email address.");
      return;
    }

    setIsValid(true);
    try {
      const existingEmails = JSON.parse(localStorage.getItem('cb_alert_emails') || '[]') as string[];
      if (!existingEmails.includes(email)) {
        localStorage.setItem('cb_alert_emails', JSON.stringify([...existingEmails, email]));
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed to save email to localStorage", err);
      setError("Failed to subscribe. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <section className="bg-green-50 dark:bg-green-950 border-t border-b border-green-200 dark:border-green-800 py-10 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-2xl font-black text-green-800 dark:text-green-200">Registration Successful! We will notify you of the best deals.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-skyline-primary/5 dark:bg-skyline-primary/10 border-t border-b border-skyline-primary/20 dark:border-skyline-primary/30 py-12 text-center">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic mb-3">
          Get India's Best Deals in Your Inbox
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8">
          We track prices across Amazon, Flipkart, Croma and more and alert you the moment prices drop.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsValid(true);
              setError(null);
            }}
            className={`w-full sm:w-80 px-5 py-3 border rounded-xl text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-skyline-primary ${!isValid ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'}`}
            aria-label="Email for price alerts"
          />
          <button
            type="submit"
            className="cb-btn-primary px-8 py-3 rounded-xl text-base font-bold shadow-lg"
          >
            Subscribe
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        <p className="text-zinc-400 text-xs mt-6">No spam. Unsubscribe any time.</p>
      </div>
    </section>
  );
};

export default PriceAlertBanner;
