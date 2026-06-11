"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import NewsletterSignup from "@/components/NewsletterSignup";
import ProductCardImage from "@/components/ProductCardImage";
import { useCart } from "@/contexts/CartContext";
import { shopifyImg } from "@/lib/img";
import type { ShopifyProduct } from "@/lib/shopify";

const HERO_IMAGE = "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=1200&q=80";

const journals = [
  {
    title: "The quiet mechanics of ritual",
    excerpt: "How a slower ritual reshapes everyday life with calm intention.",
  },
  {
    title: "Material stories in the kitchen",
    excerpt: "A closer look at craftspeople keeping tradition alive.",
  },
];

function fmt(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(amount));
}

type CardAction =
  | { type: "add"; variantId: string }
  | { type: "view"; href: string };

function getCardAction(product: ShopifyProduct): CardAction {
  const variants = product.variants?.edges ?? [];
  if (variants.length === 1) {
    return { type: "add", variantId: variants[0].node.id };
  }
  return { type: "view", href: `/collectie/${product.handle}` };
}

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const { addToCart, isLoading: cartLoading } = useCart();

  // Hero parallax: image moves at 60% of scroll speed (lags by 40%)
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, (v) => v * 0.4);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  const featured = products[0] ?? null;
  const secondary = products.slice(1, 3);

  return (
    <div className="relative overflow-hidden bg-shiro text-sumi">
      <Nav />

      <main className="relative isolate overflow-hidden">

        {/* ── HERO ── */}
        <section className="relative min-h-screen flex items-stretch">
          {/* Left: text */}
          <div className="relative z-10 flex w-full flex-col justify-center px-8 pt-32 pb-24 sm:px-12 lg:w-1/2 lg:px-16 lg:pt-40 lg:pb-32">
            <div className="absolute inset-0 flex items-center justify-start overflow-hidden pointer-events-none">
              <span className="hero-kanji select-none text-[22rem] font-kanji leading-none opacity-[0.06] -translate-x-8">
                形
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="relative max-w-lg"
            >
              <p className="font-display text-xs uppercase tracking-[0.35em] text-sumi/60">
                形 — Objects that earn their place
              </p>
              <h1 className="mt-8 font-display text-7xl leading-[0.92] tracking-[-0.03em] text-sumi sm:text-8xl">
                Own less.<br />Choose well.
              </h1>
              <p className="mt-8 text-base leading-8 text-sumi/75 sm:text-lg">
                A carefully curated collection of Japanese-inspired objects for the intentional interior.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                <Link
                  href="/collectie"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-none bg-[#2C2C2C] px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-shiro transition hover:bg-[#1a1a1a]"
                >
                  View the collection
                </Link>
                <Link
                  href="/filosofie"
                  className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-sumi/65 underline underline-offset-4 decoration-sumi/30 hover:text-mori hover:decoration-mori/50 transition"
                >
                  Our philosophy
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right: hero image with parallax (desktop only — block is hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="hidden lg:block lg:w-1/2 relative overflow-hidden"
          >
            <motion.div style={{ y: heroY }} className="absolute inset-0">
              <img
                src={HERO_IMAGE}
                alt="Japanese ceramics — quiet objects for the intentional home"
                className="absolute left-0 w-full object-cover"
                style={{ height: "140%", top: "-40%" }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-r from-shiro/30 to-transparent" />
          </motion.div>
        </section>

        {/* ── TRUST BAR ── */}
        <div className="border-t border-b border-slate-200/70 bg-white/60 py-4 px-8 sm:px-12 lg:px-16">
          <p
            className="mx-auto max-w-7xl text-center"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: "10px",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "rgba(44,44,44,0.48)",
            }}
          >
            Free shipping from €100&nbsp;&nbsp;·&nbsp;&nbsp;30-day returns&nbsp;&nbsp;·&nbsp;&nbsp;Secure checkout
          </p>
        </div>

        {/* ── FEATURED PRODUCTS ── */}
        <section id="shop" className="py-20 px-8 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12">
              <p className="font-display text-sm uppercase tracking-[0.35em] text-sumi/60">Featured products</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight text-sumi sm:text-5xl">
                A careful selection of everyday ritual objects.
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div className="product-card rounded-[32px] p-8 shadow-soft animate-pulse">
                  <div className="h-[380px] rounded-3xl bg-tsuchi/40" />
                  <div className="mt-8 space-y-3">
                    <div className="h-3 w-20 rounded bg-tsuchi/40" />
                    <div className="h-7 w-44 rounded bg-tsuchi/40" />
                    <div className="h-3 w-16 rounded bg-tsuchi/40" />
                  </div>
                </div>
                <div className="grid gap-8">
                  {[0, 1].map((i) => (
                    <div key={i} className="product-card rounded-[32px] p-8 shadow-soft animate-pulse">
                      <div className="h-56 rounded-3xl bg-tsuchi/40" />
                      <div className="mt-6 space-y-3">
                        <div className="h-3 w-20 rounded bg-tsuchi/40" />
                        <div className="h-5 w-36 rounded bg-tsuchi/40" />
                        <div className="h-3 w-12 rounded bg-tsuchi/40" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                {featured && (
                  <motion.article
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.3, ease: "easeOut" }}
                    className="product-card group relative overflow-hidden rounded-[32px] p-8 shadow-soft cursor-pointer"
                    onClick={() => router.push(`/collectie/${featured.handle}`)}
                  >
                    <div className="h-[380px] overflow-hidden rounded-3xl bg-tsuchi">
                      <ProductCardImage product={featured} width={1000} eager />
                    </div>
                    <div className="mt-8 space-y-2">
                      <p className="text-xs uppercase tracking-[0.28em] text-sumi/50">
                        {featured.productType || "Featured"}
                      </p>
                      <h3 className="text-3xl font-display text-sumi">{featured.title}</h3>
                      <p className="text-base font-medium text-sumi/80">
                        {fmt(
                          featured.priceRange.minVariantPrice.amount,
                          featured.priceRange.minVariantPrice.currencyCode
                        )}
                      </p>
                      <div className="pt-3" onClick={(e) => e.stopPropagation()}>
                        <CardCta product={featured} addToCart={addToCart} cartLoading={cartLoading} />
                      </div>
                    </div>
                  </motion.article>
                )}

                <div className="grid gap-8">
                  {secondary.map((product, index) => (
                    <motion.article
                      key={product.id}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2 + index * 0.1, ease: "easeOut" }}
                      className="product-card group overflow-hidden rounded-[32px] p-8 shadow-soft cursor-pointer"
                      onClick={() => router.push(`/collectie/${product.handle}`)}
                    >
                      <div className="h-56 overflow-hidden rounded-3xl bg-[#f3efe9]">
                        <ProductCardImage product={product} width={800} />
                      </div>
                      <div className="mt-6 space-y-2">
                        <p className="text-xs uppercase tracking-[0.25em] text-sumi/50">{product.productType}</p>
                        <p className="text-xl font-display text-sumi">{product.title}</p>
                        <p className="text-sm font-medium text-sumi/80">
                          {fmt(
                            product.priceRange.minVariantPrice.amount,
                            product.priceRange.minVariantPrice.currencyCode
                          )}
                        </p>
                        <div className="pt-2" onClick={(e) => e.stopPropagation()}>
                          <CardCta product={product} addToCart={addToCart} cartLoading={cartLoading} />
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── PILLARS ── */}
        <section id="story" className="bg-white/70 py-12 px-8 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { label: "Craft", text: "Material honesty meets Japanese craftsmanship with quiet, considered finishes." },
                { label: "Intention", text: "Every piece is chosen for form, tactility, and timeless simplicity." },
                { label: "Silence", text: "Minimal detail, generous emptiness, and spaces that breathe." },
              ].map((pillar) => (
                <motion.div
                  key={pillar.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.15 }}
                  className="rounded-[32px] border border-slate-200/60 bg-shiro/90 p-8"
                >
                  <p className="font-display text-xl uppercase tracking-[0.32em] text-sumi/80">{pillar.label}</p>
                  <p className="mt-4 text-base leading-8 text-sumi/75">{pillar.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOURNAL ── */}
        <section id="journal" className="py-14 px-8 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <p className="font-display text-sm uppercase tracking-[0.35em] text-sumi/60">Journal</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight text-sumi sm:text-5xl">
                Thoughtful essays and quiet interiors.
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {journals.map((post, index) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 + index * 0.1 }}
                  className="rounded-[32px] border border-slate-200/70 bg-white/95 p-8 shadow-soft"
                >
                  <p className="font-display text-xs uppercase tracking-[0.28em] text-sumi/50">Journal</p>
                  <h3 className="mt-5 font-display text-3xl text-sumi">{post.title}</h3>
                  <p className="mt-4 text-base leading-8 text-sumi/75">{post.excerpt}</p>
                  <Link href="/journal" className="mt-6 inline-flex text-xs font-semibold uppercase tracking-[0.2em] text-mori transition hover:text-kin">
                    Read more
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ── INSTAGRAM ── */}
        <section className="bg-white/70 py-20 px-8 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <p className="font-display text-xs uppercase tracking-[0.35em] text-sumi/50">Instagram</p>
              <h2 className="mt-6 font-display text-4xl tracking-tight text-sumi sm:text-5xl">
                Daily details in quiet frames.
              </h2>
              <p className="mt-6 text-base text-sumi/60 max-w-md mx-auto leading-8">
                Behind the objects — light, texture, and everyday moments from our studio and homes.
              </p>
              <a
                href="https://instagram.com/katachi.store"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-3 rounded-none border border-sumi/15 bg-white px-10 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-sumi transition hover:bg-shiro hover:border-sumi/30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
                Follow us @katachi.store
              </a>
            </motion.div>
          </div>
        </section>

        {/* ── NEWSLETTER ── */}
        <NewsletterSignup />

      </main>

      <Footer />
    </div>
  );
}

function CardCta({
  product,
  addToCart,
  cartLoading,
}: {
  product: ShopifyProduct;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  cartLoading: boolean;
}) {
  const action = getCardAction(product);

  const baseStyle: React.CSSProperties = {
    fontFamily: "var(--font-dm-sans)",
    fontSize: "10px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    paddingBottom: "2px",
    background: "none",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "1px solid rgba(44,44,44,0.22)",
    cursor: "pointer",
    color: "rgba(44,44,44,0.55)",
    transition: "color 0.15s, border-color 0.15s",
    textDecoration: "none",
    display: "inline-block",
  };

  if (action.type === "add") {
    return (
      <button
        style={{ ...baseStyle, opacity: cartLoading ? 0.4 : 1 }}
        disabled={cartLoading}
        onClick={() => addToCart(action.variantId)}
      >
        {cartLoading ? "Adding…" : "Add to cart"}
      </button>
    );
  }

  return (
    <Link href={`/collectie/${product.handle}`} style={baseStyle}>
      View
    </Link>
  );
}
