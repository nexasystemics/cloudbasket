// Estimated: ~100 lines
// Purpose: Displays a grid of top discounted products as part of the homepage.

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CATALOG_PRODUCTS } from '@/lib/cloudbasket-data';
import { resolveImageSource, IMAGE_ASSETS } from '@/lib/image-assets';

const TopDealsToday: React.FC = () => {
  const sortedProducts = [...CATALOG_PRODUCTS].sort((a, b) => {
    const discountA = a.mrp && a.price ? ((a.mrp - a.price) / a.mrp) * 100 : 0;
    const discountB = b.mrp && b.price ? ((b.mrp - b.price) / b.mrp) * 100 : 0;
    return discountB - discountA;
  });

  const topDeals = sortedProducts.slice(0, 6);

  if (topDeals.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic flex items-center gap-2">
          Top Deals Today
        </h2>
        <Link href="/deals" className="text-xs font-bold text-skyline-primary hover:underline flex items-center gap-1">
          View all deals
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {topDeals.map((product) => {
          const discountPercentage = product.mrp && product.price
            ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
            : 0;

          return (
            <div key={product.id} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 p-4 flex flex-col items-center text-center group transition-all hover:shadow-lg">
              <div className="relative w-40 h-40 mb-3">
                <Image
                  src={resolveImageSource(product.image, IMAGE_ASSETS.noImage)}
                  alt={product.title}
                  fill
                  sizes="160px"
                  className="object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 min-h-[40px] leading-tight mb-2">
                {product.title}
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                {discountPercentage > 0 && (
                  <p className="text-xs text-gray-400 line-through">₹{product.mrp?.toLocaleString('en-IN')}</p>
                )}
                <p className="text-lg font-black text-red-600 dark:text-red-500">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
              {discountPercentage > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 mb-2">
                  {discountPercentage}% Off
                </span>
              )}
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">{product.platform}</p>
              <Link
                href={`/go/${product.platform.toLowerCase()}-${product.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-skyline-primary hover:bg-skyline-primary-dark w-full justify-center"
              >
                Grab Deal
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopDealsToday;
