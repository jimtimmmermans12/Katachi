"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

const sections = [
  {
    number: "01",
    title: "The Origin of Form",
    body: "Japanese craft tradition values objects that improve with use. We select pieces that carry that principle — things made with patience, shaped for the hand, and finished with honest material.",
    image: "https://images.unsplash.com/photo-1612058060757-aa8f7f66e687?w=900&q=85",
    imageAlt: "White ceramic plates arranged on a warm wooden table",
    reverse: false,
  },
  {
    number: "02",
    title: "Intention Over Decoration",
    body: "Nothing in our collection exists to impress. Everything exists to be used, appreciated, and kept for a long time. A bowl that holds warmth. A cup that rewards the hand that holds it.",
    image: "https://images.unsplash.com/photo-1573756990369-50cdad6dbd03?w=900&q=85",
    imageAlt: "Ceramic bowl on a wooden surface near a window with soft natural light",
    reverse: true,
  },
  {
    number: "03",
    title: "Silence as a Design Principle",
    body: "The most intentional spaces have one thing in common: restraint. Empty shelf space is not absence — it is room for the eye to rest. We curate with that stillness in mind.",
    image: "https://images.unsplash.com/photo-1677833766788-eaa721727a69?w=900&q=85",
    imageAlt: "Japanese ceramics and stoneware arranged with quiet intention",
    reverse: false,
  },
];

export default function Filosofie() {
  return (
    <div className="relative bg-shiro text-sumi">
      <Nav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-40 pb-32 sm:px-10 lg:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
          >
            <span
              className="font-kanji text-[36rem] leading-none"
              style={{ color: "rgba(44,44,44,0.05)", textShadow: "0 0 60px rgba(247,245,242,0.7)" }}
            >
              形
            </span>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            >
              <p className="font-body text-xs uppercase tracking-[0.38em] text-sumi/50">
                KATACHI 形 — Philosophy
              </p>
              <h1 className="mt-8 font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.88] tracking-[-0.025em] text-sumi">
                Why KATACHI exists.
              </h1>
              <p className="mt-10 font-display text-xl italic leading-[1.6] text-sumi/65 sm:text-2xl">
                Every object we select must answer one question: does this earn its place?
              </p>
            </motion.div>
          </div>
        </section>

        {/* Opening paragraph */}
        <section className="border-t border-slate-200/60 bg-white/65 px-6 py-20 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
              className="font-display text-2xl leading-[1.65] text-sumi/80 sm:text-3xl sm:leading-[1.6]"
            >
              Not based on price or trend — but on craftsmanship, materiality, and the stillness it brings.
            </motion.p>
          </div>
        </section>

        {/* Three sections — alternating text / image */}
        <section className="px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            {sections.map((section, index) => (
              <motion.div
                key={section.number}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: "easeOut", delay: index * 0.1 }}
                className={`flex flex-col gap-12 border-t border-slate-200/60 py-20 sm:py-28 lg:items-center lg:gap-20 lg:flex-row${section.reverse ? " lg:flex-row-reverse" : ""}`}
              >
                {/* Text */}
                <div className="flex-1 max-w-xl">
                  <p className="font-body text-[10px] uppercase tracking-[0.45em] text-sumi/35">
                    {section.number}
                  </p>
                  <h2 className="mt-7 font-display text-4xl leading-[1.08] tracking-[-0.015em] text-sumi sm:text-5xl">
                    {section.title}
                  </h2>
                  <p className="mt-8 text-lg leading-[1.95] text-sumi/70">
                    {section.body}
                  </p>
                </div>

                {/* Image */}
                <div className="w-full overflow-hidden lg:w-[46%] lg:flex-shrink-0">
                  <img
                    src={section.image}
                    alt={section.imageAlt}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Closing tagline + CTA — more breathing room */}
        <section className="border-t border-slate-200/60 bg-white/65 px-6 py-48 sm:px-10 lg:px-14 lg:py-56">
          <div className="mx-auto max-w-5xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              className="font-display text-[clamp(3.5rem,11vw,8.5rem)] italic leading-[1.0] tracking-[-0.03em] text-sumi"
            >
              Own less.<br />Choose well.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.35 }}
              className="mt-16"
            >
              <a
                href="/collectie"
                className="inline-flex min-w-[220px] items-center justify-center bg-[#4A5240] px-12 py-4 font-body text-sm font-semibold uppercase tracking-[0.22em] text-shiro transition-colors duration-200 hover:bg-[#3f4535]"
              >
                View the collection
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
