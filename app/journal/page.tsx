"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { ARTICLES, UPCOMING, formatArticleDate } from "@/lib/journal";

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

        {/* Article grid — published first, then upcoming */}
        <section className="border-t border-slate-200/60 px-6 py-24 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-x-16 gap-y-2 md:grid-cols-2">
              {ARTICLES.map((article, index) => (
                <motion.article
                  key={article.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: index * 0.08 }}
                  className="border-t border-slate-200/70 py-14"
                >
                  <Link href={`/journal/${article.slug}`} className="group block">
                    <p className="font-body text-[10px] uppercase tracking-[0.42em] text-sumi/45">
                      {article.category}
                    </p>
                    <h2 className="mt-5 font-display text-3xl leading-[1.1] tracking-[-0.01em] text-sumi sm:text-4xl">
                      {article.title}
                    </h2>
                    <p className="mt-5 text-base leading-[1.85] text-sumi/70">
                      {article.excerpt}
                    </p>
                    <p className="mt-7 font-body text-[11px] uppercase tracking-[0.28em] text-sumi/35">
                      {formatArticleDate(article.date)} · {article.readingTime}
                      <span className="ml-6 inline-flex text-sumi/45 transition group-hover:text-mori">
                        Read →
                      </span>
                    </p>
                  </Link>
                </motion.article>
              ))}

              {UPCOMING.map((article, index) => (
                <motion.article
                  key={article.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: "easeOut",
                    delay: (ARTICLES.length + index) * 0.08,
                  }}
                  className="border-t border-slate-200/70 py-14"
                >
                  <p className="font-body text-[10px] uppercase tracking-[0.42em] text-sumi/45">
                    {article.category}
                  </p>
                  <h2 className="mt-5 font-display text-3xl leading-[1.1] tracking-[-0.01em] text-sumi sm:text-4xl">
                    {article.title}
                  </h2>
                  <p className="mt-5 text-base leading-[1.85] text-sumi/70">
                    {article.excerpt}
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
