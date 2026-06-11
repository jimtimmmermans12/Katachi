"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { ShopifyProduct } from "@/lib/shopify";
import { shopifyImg } from "@/lib/img";

export default function CollectiePage() {
  const router = useRouter();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (activeFilter === "ALL") return true;
    return product.productType.toUpperCase() === activeFilter;
  });

  const categories = Array.from(
    new Set(products.map((p) => p.productType.toUpperCase()).filter(Boolean))
  ).sort();
  const filters = ["ALL", ...categories];
  const showFilters = categories.length > 1;

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
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            >
              <p className="font-display text-xs uppercase tracking-[0.35em] text-sumi/70">選 — A curated collection</p>
              <h1 className="mt-8 text-5xl leading-[0.95] tracking-[-0.03em] text-sumi sm:text-6xl lg:text-7xl font-display">
                The collection
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-sumi/80 sm:text-lg">
                Each object is chosen for its form, craft, and timeless presence. Quiet designs that earn their place in your home.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="border-t border-slate-200/70 bg-white/70 py-12 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className="flex flex-wrap gap-4 items-center"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-sumi/60 font-display">Filter by:</p>
                <div className="flex flex-wrap gap-3">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition ${
                        activeFilter === filter
                          ? "bg-mori text-shiro shadow-soft"
                          : "bg-white border border-sumi/10 text-sumi hover:bg-mori/5"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            <p className={`text-sm text-sumi/60 ${showFilters ? "mt-4" : ""}`}>
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>
        </section>

        {/* Products Grid Section */}
        <section className="py-20 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-sumi/60 font-display uppercase tracking-[0.2em]">Loading collection...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-sumi/60 font-display uppercase tracking-[0.2em]">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <motion.article
                    key={product.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 + index * 0.08, ease: "easeOut" }}
                    className="group overflow-hidden rounded-[32px] product-card transition hover:shadow-lg cursor-pointer"
                    onClick={() => router.push(`/collectie/${product.handle}`)}
                  >
                    {/* Product Image */}
                    <div className="relative h-72 overflow-hidden bg-gradient-to-b from-tsuchi to-tsuchi/50">
                      {product.featuredImage?.url ? (
                        <img
                          src={shopifyImg(product.featuredImage.url, 800)}
                          alt={product.featuredImage.altText || product.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-tsuchi/30">
                          <span className="text-sumi/20 font-kanji text-6xl">形</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl font-display tracking-tight text-sumi line-clamp-2">
                        {product.title}
                      </h3>

                      {product.productType && (
                        <p className="text-xs uppercase tracking-[0.28em] text-sumi/60">
                          {product.productType}
                        </p>
                      )}

                      <p className="text-sm leading-6 text-sumi/75 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="pt-2 flex items-baseline justify-between">
                        <p className="text-lg font-semibold text-sumi">
                          {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: product.priceRange.minVariantPrice.currencyCode }).format(parseFloat(product.priceRange.minVariantPrice.amount))}
                        </p>
                        <Link
                          href={`/collectie/${product.handle}`}
                          className="text-xs font-semibold uppercase tracking-[0.2em] text-mori transition hover:text-kin"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="border-t border-slate-200/70 bg-white/70 py-16 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <p className="font-display text-3xl uppercase tracking-[0.35em] text-sumi sm:text-4xl">
                Each piece, carefully chosen.
              </p>
              <p className="mt-6 text-base text-sumi/75 max-w-2xl mx-auto">
                Objects selected for form, craft, and the quiet they bring to a room.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
