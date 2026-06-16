"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import NewsletterSignup from "@/components/NewsletterSignup";
import Reveal from "@/components/Reveal";
import { shopifyImg } from "@/lib/img";
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

export default function HomeClient({ products }: { products: ShopifyProduct[] }) {
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

  // Seamless loop via a true self-crossfade across two stacked <video> layers.
  // The clip's end dissolves into its own start: ~0.7s before the primary ends,
  // the other layer starts from 0 *underneath* it at full opacity while the
  // primary fades out *on top*. Because the incoming layer is opaque, the poster
  // never shows through the seam — it stays purely the initial fallback. Roles
  // swap each loop; the idle layer is paused, so only one decodes outside the
  // ~0.7s crossfade window. One rAF, gated on tab visibility.
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  useEffect(() => {
    if (!showVideo) return;
    const a = videoRefs[0].current;
    const b = videoRefs[1].current;
    if (!a || !b) return;

    const FADE = 0.7; // crossfade length in seconds
    let raf = 0;
    let front = a; // currently playing toward its end (fades out, on top)
    let back = b; // the incoming layer (starts from 0, opaque, beneath)

    const setLayer = (el: HTMLVideoElement, opacity: number, z: number) => {
      el.style.opacity = String(opacity);
      el.style.zIndex = String(z);
    };

    // Initial state: front plays from the start and is the only visible layer.
    front.currentTime = 0;
    back.currentTime = 0;
    setLayer(front, 1, 2);
    setLayer(back, 0, 1);
    void front.play();

    const tick = () => {
      const d = front.duration;
      if (d && Number.isFinite(d)) {
        const rem = d - front.currentTime;
        if (rem <= FADE) {
          // Enter / continue the crossfade: incoming opaque beneath, primary fades on top.
          if (back.paused) {
            back.currentTime = 0;
            void back.play();
          }
          setLayer(back, 1, 1);
          setLayer(front, Math.max(0, rem / FADE), 2);
          if (rem <= 0.03 || front.ended) {
            // Hand over: reset the outgoing layer and swap roles.
            front.pause();
            front.currentTime = 0;
            setLayer(front, 0, 1);
            setLayer(back, 1, 2);
            [front, back] = [back, front];
          }
        } else {
          setLayer(front, 1, 2);
          setLayer(back, 0, 1);
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
        front.pause();
        back.pause();
      } else {
        void front.play();
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // videoRefs are stable refs; effect re-runs only when the video is (de)activated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showVideo]);

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
              style={{ zIndex: 0 }}
            />
            {/* Two stacked layers crossfade end → start for a seamless loop (see effect). */}
            {showVideo &&
              videoRefs.map((ref, i) => (
                <video
                  key={i}
                  ref={ref}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ opacity: 0, zIndex: 1 }}
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <source src={HERO_VIDEO_WEBM} type="video/webm" />
                  <source src={HERO_VIDEO_MP4} type="video/mp4" />
                </video>
              ))}
            {/* Scrim for legibility — directional so it stays elegant: darkest
               behind the text (lower-left), clearing to light on the right. A
               faint uniform floor guarantees contrast on the brightest frame. */}
            <div
              className="absolute inset-0"
              style={{
                zIndex: 3,
                background: [
                  // left → right: deep behind the text, clearing to light on the right
                  "linear-gradient(90deg, rgba(44,44,44,0.74) 0%, rgba(44,44,44,0.55) 32%, rgba(44,44,44,0.18) 64%, rgba(44,44,44,0) 100%)",
                  // gentle top (nav) + stronger bottom (buttons) weighting
                  "linear-gradient(180deg, rgba(44,44,44,0.22) 0%, rgba(44,44,44,0) 30%, rgba(44,44,44,0) 58%, rgba(44,44,44,0.55) 100%)",
                  // bottom-left bloom — concentrates contrast exactly under the subtext + buttons
                  "radial-gradient(115% 90% at 0% 100%, rgba(44,44,44,0.40) 0%, rgba(44,44,44,0) 55%)",
                  // faint uniform floor — guarantees a baseline on the brightest frame
                  "rgba(44,44,44,0.10)",
                ].join(", "),
              }}
            />
            {/* 形 kanji watermark, light over the scrim */}
            <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden" style={{ zIndex: 4 }}>
              <span className="hero-kanji select-none font-kanji text-[22rem] leading-none text-shiro opacity-[0.06] -translate-x-8">
                形
              </span>
            </div>
          </div>

          {/* Content — unchanged copy + CTAs, recoloured light for the dark ground */}
          <div className="relative z-10 w-full px-8 sm:px-12 lg:px-16">
            <Reveal immediate className="mx-auto w-full max-w-7xl">
              <div className="max-w-xl">
                <p className="font-display text-xs uppercase tracking-[0.35em] text-shiro" style={{ textShadow: HERO_TEXT_SHADOW }}>
                  形 — Objects that earn their place
                </p>
                <h1 className="mt-8 font-display text-7xl leading-[0.92] tracking-[-0.03em] text-shiro sm:text-8xl" style={{ textShadow: HERO_TEXT_SHADOW }}>
                  Own less.<br />Choose well.
                </h1>
                <p className="mt-8 max-w-md text-base leading-8 text-shiro sm:text-lg" style={{ textShadow: HERO_TEXT_SHADOW }}>
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
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-none border border-shiro/70 bg-transparent px-10 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-shiro transition hover:border-shiro hover:bg-shiro/10"
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
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3">
                {products.map((product, index) => {
                  const img = product.featuredImage;
                  return (
                    <Reveal key={product.id} delay={index * 60}>
                      <Link href={`/collectie/${product.handle}`} className="group block">
                        {/* Image — shared 4:5 ratio, object-cover, sits on the page (no card).
                            A 3px radius just takes the hard edge off the corners. */}
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-[#ece7df]">
                          {img?.url ? (
                            <img
                              src={shopifyImg(img.url, 900)}
                              alt={img.altText ?? product.title}
                              loading={index === 0 ? undefined : "lazy"}
                              className="absolute inset-0 h-full w-full rounded-[3px] object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                            />
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
                  );
                })}
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
