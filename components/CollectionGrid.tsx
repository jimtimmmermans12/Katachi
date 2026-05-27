"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { ShopifyProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/shopify";

type Props = {
  products: ShopifyProduct[];
};

export default function CollectionGrid({ products }: Props) {
  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((p) => p.productType).filter(Boolean))
    ).sort(),
  ];

  const [activeFilter, setActiveFilter] = useState("All");

  const visible =
    activeFilter === "All"
      ? products
      : products.filter((p) => p.productType === activeFilter);

  return (
    <>
      {/* Filter bar */}
      <div className="border-t border-b border-slate-200/65 px-6 py-5 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-y-2">
            {categories.map((filter, i) => (
              <span key={filter} className="flex items-center">
                {i > 0 && (
                  <span className="mx-5 select-none text-sumi/25">—</span>
                )}
                <button
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={[
                    "font-body text-xs uppercase tracking-[0.32em] transition-colors duration-200 pb-px",
                    activeFilter === filter
                      ? "text-sumi border-b border-sumi"
                      : "text-sumi/45 hover:text-sumi/75",
                  ].join(" ")}
                >
                  {filter}
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <section className="px-6 py-24 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-x-16 gap-y-24 sm:grid-cols-2"
            >
              {visible.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.75,
                    delay: index * 0.07,
                    ease: "easeOut",
                  }}
                >
                  {/* Product image */}
                  <div className="aspect-square w-full overflow-hidden bg-[#EDE9E3]">
                    {product.featuredImage ? (
                      <Image
                        src={product.featuredImage.url}
                        alt={product.featuredImage.altText ?? product.title}
                        width={800}
                        height={800}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : null}
                  </div>

                  {/* Product info */}
                  <div className="mt-8 space-y-3">
                    {product.productType && (
                      <p className="font-body text-[10px] uppercase tracking-[0.38em] text-sumi/50">
                        {product.productType}
                      </p>
                    )}
                    <h2 className="font-body text-sm font-semibold uppercase tracking-[0.3em] text-sumi">
                      {product.title}
                    </h2>
                    {product.description && (
                      <p className="font-display text-lg italic leading-[1.75] text-sumi/75">
                        {product.description}
                      </p>
                    )}
                    <p className="font-body text-sm font-medium text-sumi/85">
                      {formatPrice(product.priceRange.minVariantPrice)}
                    </p>
                    <a
                      href={`/collectie/${product.handle}`}
                      className="group mt-1 inline-flex items-center gap-2 font-body text-[11px] uppercase tracking-[0.28em] text-mori transition-colors duration-200 hover:text-kin"
                    >
                      View object
                      <span
                        aria-hidden
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </a>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
