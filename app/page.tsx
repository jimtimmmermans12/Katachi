"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

const products = [
  {
    name: "Hikari Miska",
    description: "Handcrafted stoneware bowl",
    price: "€ 98",
    accent: "mori",
  },
  {
    name: "Kaze Sake Set",
    description: "Soft matte porcelain",
    price: "€ 124",
    accent: "tsuchi",
  },
  {
    name: "Sumi Tray",
    description: "Charcoal lacquered details",
    price: "€ 84",
    accent: "kin",
  },
];

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

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-shiro text-sumi">
      <Nav />

      <main className="relative isolate overflow-hidden">
        <section className="relative min-h-screen px-6 pt-28 pb-24 sm:px-10 lg:px-14">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="hero-kanji pointer-events-none select-none text-[28rem] font-kanji leading-none opacity-20">
              形
            </span>
          </div>

          <div className="relative mx-auto flex max-w-6xl flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <p className="font-display text-xs uppercase tracking-[0.35em] text-sumi/70">形 — Objects that earn their place</p>
              <h1 className="mt-8 text-6xl leading-[0.95] tracking-[-0.03em] text-sumi sm:text-7xl lg:text-8xl font-display">
                Own less. Choose well.
              </h1>
              <p className="mt-8 max-w-xl text-base leading-8 text-sumi/80 sm:text-lg">
                A carefully curated collection of Japanese-inspired objects for the intentional interior.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/collectie"
                  className="inline-flex items-center justify-center rounded-none border-none bg-[#4A5240] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-shiro transition hover:bg-[#3f4535]"
                >
                  View the collection
                </a>
                <a
                  href="/filosofie"
                  className="inline-flex items-center justify-center rounded-full border border-sumi/10 bg-white/80 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-sumi transition hover:bg-white"
                >
                  Our philosophy
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-t border-slate-200/70 bg-white/70 py-16 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="font-display text-4xl uppercase tracking-[0.35em] text-sumi sm:text-5xl"
            >
              Form. Intention. Silence.
            </motion.p>
          </div>
        </section>

        <section id="shop" className="py-20 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-sm uppercase tracking-[0.35em] text-sumi/70">Featured products</p>
                <h2 className="mt-4 text-4xl font-display tracking-tight text-sumi sm:text-5xl">
                  A careful selection of everyday ritual objects.
                </h2>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <motion.article
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.3, ease: "easeOut" }}
                className="product-card group relative overflow-hidden rounded-[32px] p-8 shadow-soft"
              >
                <div className="h-[380px] overflow-hidden rounded-3xl bg-tsuchi" />
                <div className="mt-8 max-w-xl space-y-4">
                  <p className="text-sm uppercase tracking-[0.28em] text-sumi/60">Best seller</p>
                  <h3 className="text-3xl font-display text-sumi">Hikari Miska</h3>
                  <p className="max-w-md text-sm leading-7 text-sumi/80">Handcrafted stoneware with soft glaze and quiet presence.</p>
                  <p className="text-lg font-semibold text-sumi">€ 98</p>
                </div>
              </motion.article>

              <div className="grid gap-8">
                {products.slice(1).map((product, index) => (
                  <motion.article
                    key={product.name}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2 + index * 0.1, ease: "easeOut" }}
                    className="product-card overflow-hidden rounded-[32px] p-8 shadow-soft"
                  >
                    <div className="h-56 overflow-hidden rounded-3xl bg-[#f3efe9]" />
                    <div className="mt-6 space-y-3">
                      <p className="text-sm uppercase tracking-[0.25em] text-sumi/70">{product.name}</p>
                      <p className="text-xl font-display text-sumi">{product.description}</p>
                      <p className="text-base font-semibold text-sumi">{product.price}</p>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="bg-white/70 py-20 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  label: "Craft",
                  text: "Material honesty meets Japanese craftsmanship with quiet, considered finishes.",
                },
                {
                  label: "Intention",
                  text: "Every piece is chosen for form, tactility, and timeless simplicity.",
                },
                {
                  label: "Silence",
                  text: "Minimal detail, generous emptiness, and spaces that breathe.",
                },
              ].map((pillar) => (
                <motion.div
                  key={pillar.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.15 }}
                  className="rounded-[32px] border border-slate-200/60 bg-shiro/90 p-10"
                >
                  <p className="font-display text-xl uppercase tracking-[0.32em] text-sumi/80">
                    {pillar.label}
                  </p>
                  <p className="mt-6 text-base leading-8 text-sumi/80">{pillar.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="journal" className="py-20 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-sm uppercase tracking-[0.35em] text-sumi/70">Journal</p>
                <h2 className="mt-4 text-4xl font-display tracking-tight text-sumi sm:text-5xl">
                  Thoughtful essays and quiet interiors.
                </h2>
              </div>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {journals.map((post, index) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 + index * 0.1 }}
                  className="rounded-[32px] border border-slate-200/70 bg-white/95 p-10 shadow-soft"
                >
                  <p className="font-display text-sm uppercase tracking-[0.28em] text-sumi/70">Journal</p>
                  <h3 className="mt-6 text-3xl font-display text-sumi">{post.title}</h3>
                  <p className="mt-5 text-base leading-8 text-sumi/80">{post.excerpt}</p>
                  <a href="#" className="mt-7 inline-flex text-sm font-semibold uppercase tracking-[0.2em] text-mori transition hover:text-kin">
                    Read more
                  </a>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white/70 py-20 px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-display text-sm uppercase tracking-[0.35em] text-sumi/70">Instagram</p>
                <h2 className="mt-4 text-4xl font-display tracking-tight text-sumi sm:text-5xl">
                  Daily details in quiet frames.
                </h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: index * 0.05 }}
                  className="aspect-square rounded-3xl bg-slate-100 shadow-soft"
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
