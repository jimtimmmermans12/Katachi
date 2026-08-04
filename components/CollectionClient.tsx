"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import type { ShopifyProduct } from "@/lib/shopify";
import ProductCardImage from "@/components/ProductCardImage";

function fmt(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount));
}

export default function CollectionClient({ products }: { products: ShopifyProduct[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const filteredProducts = products.filter((product) => {
    if (activeFilter === "ALL") return true;
    return product.productType.toUpperCase() === activeFilter;
  });

  const categories = Array.from(
    new Set(products.map((p) => p.productType.toUpperCase()).filter(Boolean))
  ).sort();
  const filters = ["ALL", ...categories];
  const showFilters = categories.length >= 1;

  return (
    <div className="relative overflow-hidden bg-shiro text-sumi">
      <Nav />

      <main className="relative isolate overflow-hidden">
        {/* Header Section */}
        <section className="relative min-h-[50vh] px-6 pt-28 pb-16 sm:px-10 lg:px-14">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            <span className="hero-kanji select-none text-[18rem] font-kanji leading-none opacity-10">
              選
            </span>
          </div>

          <div className="relative mx-auto max-w-6xl">
            <Reveal immediate>
              <p className="font-display text-xs uppercase tracking-[0.35em] text-sumi/70">選 — A curated collection</p>
              <h1 className="mt-8 text-5xl leading-[0.95] tracking-[-0.03em] text-sumi sm:text-6xl lg:text-7xl font-display">
                The collection
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-sumi/80 sm:text-lg">
                Each object is chosen for its form, craft, and timeless presence. Quiet designs that earn their place in your home.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Filter Section */}
        <section className="border-t border-slate-200/70 bg-white/70 py-12 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            {showFilters && (
              <Reveal immediate className="flex flex-wrap gap-4 items-center">
                <p className="text-xs uppercase tracking-[0.28em] text-sumi/60 font-display">Filter by:</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      aria-pressed={activeFilter === filter}
                      className={`px-1 py-2 text-xs font-semibold uppercase tracking-[0.2em] underline-offset-[6px] transition ${
                        activeFilter === filter
                          ? "text-sumi underline decoration-sumi/40"
                          : "text-sumi/45 hover:text-sumi"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </Reveal>
            )}
            <p className={`text-sm text-sumi/60 ${showFilters ? "mt-4" : ""}`}>
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="py-20 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            {filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-sumi/60 font-display uppercase tracking-[0.2em]">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <Reveal key={product.id} as="article" delay={(index % 3) * 50}>
                    <Link href={`/collectie/${product.handle}`} className="group block">
                      {/* Image — same flat 4:5 treatment as the homepage grid:
                          no card, no border, a 3px radius to soften the corners. */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-[#ece7df]">
                        {product.featuredImage?.url ? (
                          <div className="absolute inset-0">
                            <ProductCardImage product={product} width={900} />
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-tsuchi">
                            <span className="font-kanji text-6xl text-sumi/10">形</span>
                          </div>
                        )}
                      </div>

                      {/* Text — left-aligned under the image */}
                      <p
                        className="mt-5 text-[11px] uppercase tracking-[0.28em]"
                        style={{ color: "color-mix(in srgb, var(--tsuchi), var(--sumi) 35%)" }}
                      >
                        {product.productType || "Katachi"}
                      </p>
                      <h3 className="mt-2 font-display text-2xl leading-tight text-sumi">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-sm text-sumi/70">
                        {fmt(
                          product.priceRange.minVariantPrice.amount,
                          product.priceRange.minVariantPrice.currencyCode
                        )}
                      </p>
                      <span className="mt-3 inline-flex text-xs uppercase tracking-[0.2em] text-sumi/50 opacity-0 transition-opacity duration-[400ms] group-hover:opacity-100 motion-reduce:opacity-100 motion-reduce:transition-none">
                        View&nbsp;→
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="border-t border-slate-200/70 bg-white/70 py-16 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl text-center">
            <Reveal>
              <p className="font-display text-3xl tracking-tight text-sumi sm:text-4xl">
                Each piece, carefully chosen.
              </p>
              <p className="mt-6 text-base text-sumi/75 max-w-2xl mx-auto">
                Objects selected for form, craft, and the quiet they bring to a room.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
