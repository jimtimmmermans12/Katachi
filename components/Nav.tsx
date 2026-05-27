"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Collection", href: "/collectie" },
  { label: "Philosophy", href: "/filosofie" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.pageYOffset > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ opacity: 1 }}
      className={`fixed inset-x-0 z-50 transition duration-500 ${
        scrolled
          ? "bg-white/72 backdrop-blur-xl border-b border-slate-200/70 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="/" className="flex items-center gap-2 font-display text-base uppercase tracking-[0.25em] text-sumi">
          <span>KATACHI</span>
          <span className="text-kin">形</span>
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm uppercase tracking-[0.25em] text-sumi transition hover:text-mori"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsOpen((value) => !value)}
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-current text-sumi transition hover:bg-mori/5 md:hidden"
        >
          <span className="absolute h-0.5 w-6 rotate-0 bg-current transition duration-300" />
          <span className="absolute h-0.5 w-6 bg-current transition duration-300" />
          <span className="absolute h-0.5 w-6 translate-y-2 bg-current transition duration-300" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl"
          >
            <div className="flex h-full flex-col items-center justify-center gap-10 px-8 text-center">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-sumi"
              >
                ✕
              </button>
              <div className="space-y-8 text-lg uppercase tracking-[0.3em] text-sumi">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block transition hover:text-mori"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 text-sm text-sumi/75">
                <span>Tel. +31 20 123 4567</span>
                <span>hello@KATACHI.store</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
