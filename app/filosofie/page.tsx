"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

const sections = [
  {
    number: "01",
    title: "The Origin of Form",
    body: "Japanese craft tradition values objects that improve with use. We select pieces that carry that principle.",
  },
  {
    number: "02",
    title: "Intention Over Decoration",
    body: "Nothing in our collection exists to impress. Everything exists to be used, appreciated, and kept for a long time.",
  },
  {
    number: "03",
    title: "Silence as a Design Principle",
    body: "The most intentional spaces have one thing in common: restraint. We curate with that in mind.",
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

        {/* Three sections */}
        <section className="px-6 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl">
            {sections.map((section, index) => (
              <motion.div
                key={section.number}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: "easeOut", delay: index * 0.1 }}
                className="border-t border-slate-200/60 py-28"
              >
                <p className="font-body text-[10px] uppercase tracking-[0.45em] text-sumi/35">
                  {section.number}
                </p>
                <h2 className="mt-7 font-display text-4xl leading-[1.08] tracking-[-0.015em] text-sumi sm:text-5xl">
                  {section.title}
                </h2>
                <p className="mt-10 text-lg leading-[1.95] text-sumi/70">
                  {section.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Closing tagline */}
        <section className="border-t border-slate-200/60 bg-white/65 px-6 py-40 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-5xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              className="font-display text-[clamp(3rem,9vw,7rem)] italic leading-[1.02] tracking-[-0.025em] text-sumi"
            >
              Own less. Choose well.
            </motion.p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
