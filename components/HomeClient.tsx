"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import NewsletterSignup from "@/components/NewsletterSignup";
import ProductCardImage from "@/components/ProductCardImage";
import Reveal from "@/components/Reveal";
import { useCart } from "@/contexts/CartContext";
import type { ShopifyProduct } from "@/lib/shopify";

// Poster shows instantly and stands in for the video on reduced-motion / slow
// loads. Using the existing hero photo until a dedicated poster is exported.
const HERO_POSTER = "/hero-katachi.jpg";
const HERO_VIDEO_WEBM = "/hero.webm";
const HERO_VIDEO_MP4 = "/hero.mp4";

// Whisper-light shadow: wide blur, low opacity — invisible as a shadow but lifts
// the light hero text off the brightest video frames. Scoped to the light text
// only (never the solid Shiro primary button).
const HERO_TEXT_SHADOW = "0 1px 28px rgba(28,28,28,0.35)";

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
  | { type: "add"; variantId: string; available: boolean }
  | { type: "view"; href: string };

function getCardAction(product: ShopifyProduct): CardAction {
  const variants = product.variants?.edges ?? [];
  // Single variant → add straight to cart. Multiple variants → send to the
  // product page so the customer can choose before adding.
  if (variants.length === 1) {
    return {
      type: "add",
      variantId: variants[0].node.id,
      available: variants[0].node.availableForSale,
    };
  }
  return { type: "view", href: `/collectie/${product.handle}` };
}

export default function HomeClient({ products }: { products: ShopifyProduct[] }) {
  const router = useRouter();
  const { addToCart, isLoading: cartLoading } = useCart();

  // Hero video: rendered only after mount and only when the visitor hasn't asked
  // for reduced motion. So reduced-motion users get the static poster and never
  // fetch the video, SSR emits the poster alone, and there's no hydration flash.
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShowVideo(!mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const featured = products[0] ?? null;
  const secondary = products.slice(1, 3);

  return (
    <div className="relative overflow-hidden bg-shiro text-sumi">
      <Nav overlay />

      <main className="relative isolate overflow-hidden">

        {/* ── HERO ── full-bleed video behind the existing copy + CTAs */}
        <section className="relative flex items-center overflow-hidden h-[80vh] min-h-[34rem] lg:h-[85vh]">
          {/* Preload the poster so first paint is immediate; doesn't block render. */}
          <link rel="preload" as="image" href={HERO_POSTER} fetchPriority="high" />

          {/* Background stack: poster (instant) → video (motion only) → dark scrim */}
          <div className="absolute inset-0">
            <img
              src={HERO_POSTER}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {showVideo && (
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={HERO_POSTER}
                aria-hidden="true"
                tabIndex={-1}
              >
                <source src={HERO_VIDEO_WEBM} type="video/webm" />
                <source src={HERO_VIDEO_MP4} type="video/mp4" />
              </video>
            )}
            {/* Scrim for legibility — directional so it stays elegant: darkest
               behind the text (lower-left), clearing to light on the right. A
               faint uniform floor guarantees contrast on the brightest frame. */}
            <div
              className="absolute inset-0"
              style={{
                background: [
                  "linear-gradient(90deg, rgba(44,44,44,0.64) 0%, rgba(44,44,44,0.42) 32%, rgba(44,44,44,0.12) 64%, rgba(44,44,44,0) 100%)",
                  "linear-gradient(180deg, rgba(44,44,44,0.22) 0%, rgba(44,44,44,0) 30%, rgba(44,44,44,0) 60%, rgba(44,44,44,0.40) 100%)",
                  "rgba(44,44,44,0.10)",
                ].join(", "),
              }}
            />
            {/* 形 kanji watermark, light over the scrim */}
            <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
              <span className="hero-kanji select-none font-kanji text-[22rem] leading-none text-shiro opacity-[0.06] -translate-x-8">
                形
              </span>
            </div>
          </div>

          {/* Content — unchanged copy + CTAs, recoloured light for the dark ground */}
          <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16">
            <Reveal immediate className="mx-auto w-full max-w-7xl">
              <div className="max-w-xl">
                <p className="font-display text-xs uppercase tracking-[0.35em] text-shiro/80" style={{ textShadow: HERO_TEXT_SHADOW }}>
                  形 — Objects that earn their place
                </p>
                <h1 className="mt-8 font-display text-7xl leading-[0.92] tracking-[-0.03em] text-shiro sm:text-8xl" style={{ textShadow: HERO_TEXT_SHADOW }}>
                  Own less.<br />Choose well.
                </h1>
                <p className="mt-8 max-w-md text-base leading-8 text-shiro/90 sm:text-lg" style={{ textShadow: HERO_TEXT_SHADOW }}>
                  A carefully curated collection of Japanese-inspired objects for the intentional interior.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                  <Link
                    href="/collectie"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-none border-none bg-shiro px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-sumi transition hover:bg-white"
                  >
                    View the collection
                  </Link>
                  <Link
                    href="/filosofie"
                    className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-shiro/90 underline underline-offset-4 decoration-shiro/60 hover:text-shiro hover:decoration-shiro/80 transition"
                    style={{ textShadow: HERO_TEXT_SHADOW }}
                  >
                    Our philosophy
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <Reveal as="div" className="border-t border-b border-slate-200/70 bg-white/60 py-4 px-8 sm:px-12 lg:px-16">
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
        </Reveal>

        {/* ── FEATURED PRODUCTS ── */}
        <section id="shop" className="py-20 px-8 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mb-12">
              <p className="font-display text-sm uppercase tracking-[0.35em] text-sumi/60">Featured products</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight text-sumi sm:text-5xl">
                A careful selection of everyday ritual objects.
              </h2>
            </Reveal>

            {products.length === 0 ? (
              <p className="text-sm uppercase tracking-[0.2em] text-sumi/50 font-display">
                The collection is being prepared.
              </p>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
                {featured && (
                  <Reveal
                    as="article"
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
                  </Reveal>
                )}

                <div className="grid gap-8">
                  {secondary.map((product, index) => (
                    <Reveal
                      key={product.id}
                      as="article"
                      delay={(index + 1) * 50}
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
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {products.length > 0 && (
              <Reveal className="mt-14 text-center">
                <Link
                  href="/collectie"
                  className="inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-sumi/55 underline underline-offset-[6px] decoration-sumi/25 transition hover:text-mori hover:decoration-mori/40"
                >
                  View the full collection
                </Link>
              </Reveal>
            )}
          </div>
        </section>

        {/* ── MANIFESTO ── */}
        <section className="bg-shiro px-8 py-[120px] sm:px-12 lg:px-16">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-display text-xs uppercase tracking-[0.35em] text-sumi/45">
              On objects and intention
            </p>
            <p className="mx-auto mt-8 max-w-2xl font-display text-3xl leading-[1.25] tracking-tight text-sumi sm:text-4xl lg:text-5xl">
              We believe a home should hold only what it needs — and nothing more.
            </p>
            <p className="mx-auto mt-8 max-w-[520px] text-base leading-8 text-sumi/65">
              Each object in the KATACHI collection is chosen for its material honesty,
              its quiet presence, and its ability to earn its place. Not decoration.
              Not excess. Just form, meeting purpose.
            </p>
            <Link
              href="/filosofie"
              className="mt-10 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-sumi/55 underline underline-offset-[6px] decoration-sumi/25 transition hover:text-mori hover:decoration-mori/40"
            >
              Read our philosophy →
            </Link>
          </Reveal>
        </section>

        {/* ── PILLARS ── */}
        <section id="story" className="bg-white/70 py-12 px-8 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { label: "Craft", text: "Material honesty meets Japanese craftsmanship with quiet, considered finishes." },
                { label: "Intention", text: "Every piece is chosen for form, tactility, and timeless simplicity." },
                { label: "Silence", text: "Minimal detail, generous emptiness, and spaces that breathe." },
              ].map((pillar, index) => (
                <Reveal
                  key={pillar.label}
                  delay={index * 50}
                  className="rounded-[32px] border border-slate-200/60 bg-shiro/90 p-8"
                >
                  <p className="font-display text-xl uppercase tracking-[0.32em] text-sumi/80">{pillar.label}</p>
                  <p className="mt-4 text-base leading-8 text-sumi/75">{pillar.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOURNAL ── */}
        <section id="journal" className="py-12 px-8 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mb-8">
              <p className="font-display text-sm uppercase tracking-[0.35em] text-sumi/60">Journal</p>
              <h2 className="mt-4 font-display text-4xl tracking-tight text-sumi sm:text-5xl">
                Thoughtful essays and quiet interiors.
              </h2>
            </Reveal>
            <div className="grid gap-6 lg:grid-cols-2">
              {journals.map((post, index) => (
                <Reveal
                  key={post.title}
                  as="article"
                  delay={index * 50}
                  className="rounded-[32px] border border-slate-200/70 bg-white/95 p-7 shadow-soft"
                >
                  <p className="font-display text-xs uppercase tracking-[0.28em] text-sumi/50">Journal</p>
                  <h3 className="mt-4 font-display text-3xl text-sumi">{post.title}</h3>
                  <p className="mt-3 text-base leading-8 text-sumi/75">{post.excerpt}</p>
                  <Link href="/journal" className="mt-5 inline-flex text-xs font-semibold uppercase tracking-[0.2em] text-mori transition hover:text-kin">
                    Read more
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── INSTAGRAM ── */}
        <section className="bg-white/70 py-20 px-8 sm:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl text-center">
            <Reveal>
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
            </Reveal>
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

  // Echoes the product-page add-to-cart button: solid sumi block, DM Sans
  // micro-caps, calm hover. DM Sans is the default body font, so no override needed.
  const buttonClass =
    "flex h-12 w-full items-center justify-center bg-[#2C2C2C] text-[11px] font-medium uppercase tracking-[0.15em] text-shiro no-underline transition hover:bg-[#1a1a1a]";

  if (action.type === "add") {
    const soldOut = !action.available;
    return (
      <button
        type="button"
        className={buttonClass}
        style={{
          opacity: cartLoading || soldOut ? 0.5 : 1,
          cursor: soldOut ? "not-allowed" : cartLoading ? "wait" : "pointer",
        }}
        disabled={cartLoading || soldOut}
        onClick={() => addToCart(action.variantId)}
      >
        {soldOut ? "Sold out" : cartLoading ? "Adding…" : "Add to cart"}
      </button>
    );
  }

  // Multiple variants → take the customer to the product page to choose.
  return (
    <Link href={action.href} className={buttonClass}>
      Add to cart
    </Link>
  );
}
