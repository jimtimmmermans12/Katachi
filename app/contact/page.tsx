"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

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
                KATACHI 形 — Contact
              </p>
              <h1 className="mt-8 font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.88] tracking-[-0.025em] text-sumi">
                Get in touch.
              </h1>
              <p className="mt-9 font-display text-xl italic leading-[1.6] text-sumi/65 sm:text-2xl">
                Questions about an object, an order, or something else entirely.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact content */}
        <section className="border-t border-slate-200/60 px-6 py-24 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            >
              {/* Email */}
              <div className="mb-20">
                <p className="font-body text-[10px] uppercase tracking-[0.42em] text-sumi/45">
                  Email
                </p>
                <a
                  href="mailto:hello@katachi.store"
                  className="mt-4 block font-display text-2xl text-sumi transition-colors hover:text-mori sm:text-3xl"
                >
                  hello@katachi.store
                </a>
              </div>

              {/* Form */}
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="border-t border-slate-200/60 py-20"
                >
                  <p className="font-body text-[10px] uppercase tracking-[0.42em] text-sumi/45">
                    Received
                  </p>
                  <p className="mt-6 font-display text-3xl text-sumi">
                    Thank you. We'll be in touch.
                  </p>
                  <p className="mt-4 text-base leading-[1.8] text-sumi/65">
                    We respond within 2 business days.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="border-t border-slate-200/60 pt-16 space-y-10">
                  <div className="grid gap-10 sm:grid-cols-2">
                    <div className="space-y-3">
                      <label
                        htmlFor="name"
                        className="block font-body text-[10px] uppercase tracking-[0.42em] text-sumi/50"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className="w-full border-b border-slate-300 bg-transparent pb-3 pt-1 text-base text-sumi placeholder:text-sumi/30 focus:border-sumi focus:outline-none transition-colors duration-200"
                        placeholder="Your name"
                      />
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="email"
                        className="block font-body text-[10px] uppercase tracking-[0.42em] text-sumi/50"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="w-full border-b border-slate-300 bg-transparent pb-3 pt-1 text-base text-sumi placeholder:text-sumi/30 focus:border-sumi focus:outline-none transition-colors duration-200"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="message"
                      className="block font-body text-[10px] uppercase tracking-[0.42em] text-sumi/50"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      className="w-full resize-none border-b border-slate-300 bg-transparent pb-3 pt-1 text-base text-sumi placeholder:text-sumi/30 focus:border-sumi focus:outline-none transition-colors duration-200"
                      placeholder="Tell us what's on your mind."
                    />
                  </div>

                  <div className="flex flex-col gap-6 pt-4 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center bg-[#4A5240] px-10 py-4 font-body text-sm font-semibold uppercase tracking-[0.22em] text-shiro transition-colors duration-200 hover:bg-[#3f4535]"
                    >
                      Send message
                    </button>
                    <p className="text-sm text-sumi/50">
                      We respond within 2 business days.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
