"use client";

import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

const articles = [
  {
    id: 1,
    category: "Ritual",
    title: "The quiet mechanics of ritual",
    description:
      "How a slower morning shapes the hours that follow — and why the objects you reach for first matter more than you think.",
  },
  {
    id: 2,
    category: "Craft",
    title: "Material stories in the kitchen",
    description:
      "A closer look at craftspeople keeping slow, considered making alive in a world that rewards speed above all else.",
  },
  {
    id: 3,
    category: "Objects",
    title: "On the weight of a good bowl",
    description:
      "Why mass and tactility tell you more about an object's character than its appearance ever could.",
  },
  {
    id: 4,
    category: "Interiors",
    title: "Restraint as a room's best feature",
    description:
      "The discipline of stopping before adding one thing too many — and what that empty space quietly gives back.",
  },
  {
    id: 5,
    category: "Material",
    title: "What linen knows that cotton forgot",
    description:
      "The case for natural, aged textiles in the home — and why softening with time is a feature, not a flaw.",
  },
  {
    id: 6,
    category: "Living",
    title: "Buying once, keeping forever",
    description:
      "Against disposability and for the objects that outlast trends, ownership cycles, and interior fashions.",
  },
];

export default function Journal() {
  return (
    <div className="relative bg-shiro text-sumi">
      <Nav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-40 pb-28 sm:px-10 lg:px-14">
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
                KATACHI 形 — Journal
              </p>
              <h1 className="mt-8 font-display text-[clamp(4rem,12vw,9rem)] leading-[0.88] tracking-[-0.025em] text-sumi">
                Journal
              </h1>
              <p className="mt-9 font-display text-xl italic leading-[1.6] text-sumi/65 sm:text-2xl">
                Thoughtful essays on objects, craft and intentional living.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Article grid */}
        <section className="border-t border-slate-200/60 px-6 py-24 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-x-16 gap-y-2 md:grid-cols-2">
              {articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: index * 0.08 }}
                  className="border-t border-slate-200/70 py-14"
                >
                  <p className="font-body text-[10px] uppercase tracking-[0.42em] text-sumi/45">
                    {article.category}
                  </p>
                  <h2 className="mt-5 font-display text-3xl leading-[1.1] tracking-[-0.01em] text-sumi sm:text-4xl">
                    {article.title}
                  </h2>
                  <p className="mt-5 text-base leading-[1.85] text-sumi/70">
                    {article.description}
                  </p>
                  <p className="mt-7 font-body text-[11px] uppercase tracking-[0.28em] text-sumi/30">
                    Coming soon
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
