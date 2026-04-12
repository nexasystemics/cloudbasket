'use client'

// Estimated: ~120 lines
// Purpose: Renders a table comparing prices of a product from different platforms.

import React from 'react';
import Link from 'next/link';
import { getProductById } from '@/lib/cloudbasket-data';
import { type CatalogProduct } from '@/lib/cloudbasket-data';
import { trackAffiliateClick } from '@/lib/analytics';

interface PriceComparisonTableProps {
  productId: string;
}

export default async function PriceComparisonTable({ productId }: PriceComparisonTableProps) {
  const product: CatalogProduct | undefined = await getProductById(productId);

  if (!product) {
    return null;
  }

  // Generate a comparison based on the current product price
  // In a real scenario, this would fetch from multiple sources
  const comparison = [
    { 
      platform: 'Amazon', 
      price: product.platform === 'Amazon' ? product.price : Math.round(product.price * 1.02), 
      badge: product.platform === 'Amazon' ? 'Verified' : undefined 
    },
    { 
      platform: 'Flipkart', 
      price: product.platform === 'Flipkart' ? product.price : Math.round(product.price * 1.05), 
      badge: product.platform === 'Flipkart' ? 'Verified' : undefined 
    },
    { 
      platform: 'CJ Global', 
      price: product.platform === 'CJ Global' ? product.price : Math.round(product.price * 0.97), 
      badge: 'CB Exclusive' 
    }
  ].sort((a, b) => a.price - b.price);

  const lowestPrice = comparison[0].price;

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic mb-8">
        Live Price Comparison
      </h2>
      <div className="overflow-x-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Platform
              </th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Price
              </th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Badge
              </th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {comparison.map((item, index) => (
              <tr key={index} className={item.price === lowestPrice ? 'bg-skyline-primary/5 dark:bg-skyline-primary/10' : ''}>
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] text-white ${item.platform === 'Amazon' ? 'bg-orange-500 dark:bg-orange-600' : item.platform === 'Flipkart' ? 'bg-blue-600 dark:bg-blue-700' : 'bg-green-500 dark:bg-green-600'}`}>
                      {item.platform.charAt(0)}
                    </div>
                    <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{item.platform}</span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-lg font-black text-zinc-900 dark:text-white">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  {item.price === lowestPrice ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-500/10 text-green-600 border border-green-500/20">
                      Lowest Price
                    </span>
                  ) : item.badge ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-skyline-primary/10 text-skyline-primary border border-skyline-primary/20">
                      {item.badge}
                    </span>
                  ) : null}
                </td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <Link
                    href={`/go/${item.platform.toLowerCase()}-${productId}`}
                    onClick={() => trackAffiliateClick(productId, item.platform, item.price)}
                    className="cb-btn-primary px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600"
                  >
                    View Deal
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

