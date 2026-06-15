"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";

const navItems = [
  { label: "Collection", href: "/collectie" },
  { label: "Philosophy", href: "/filosofie" },
  { label: "Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
];

export default function Nav({ overlay = false }: { overlay?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart, openDrawer } = useCart();
  const itemCount = cart?.totalQuantity ?? 0;

  // On overlay pages (e.g. the homepage video hero) the bar floats over a dark
  // background while at the top, so logo/links/icons render light. Once scrolled
  // the bar gains its solid white treatment and reverts to the dark-on-light text.
  const light = overlay && !scrolled;

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
        {/* Logo */}
        <Link href="/" className={`flex items-center gap-2 font-display text-base uppercase tracking-[0.25em] transition-colors duration-500 ${light ? "text-shiro" : "text-sumi"}`}>
          <span>KATACHI</span>
          <span className="text-kin">形</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm uppercase tracking-[0.25em] transition-colors duration-500 ${light ? "text-shiro/90 hover:text-shiro" : "text-sumi hover:text-mori"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: cart icon + mobile hamburger */}
        <div className="flex items-center gap-4">
          {/* Cart icon — visible on all breakpoints */}
          <button
            type="button"
            aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
            onClick={openDrawer}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', color: light ? 'var(--shiro, #F7F5F2)' : 'var(--sumi, #2C2C2C)', transition: 'color 0.5s' }}
          >
            {/* Bag icon */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9V7a5 5 0 0 1 10 0v2"/>
              <rect x="2" y="9" width="18" height="12" rx="1"/>
            </svg>

            {/* Badge */}
            {itemCount > 0 && (
              <span style={{
                position: 'absolute', top: '1px', right: '1px',
                minWidth: '16px', height: '16px',
                background: 'var(--mori, #4A5240)',
                color: '#fff',
                borderRadius: '999px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-dm-sans)', fontSize: '9px', fontWeight: 600,
                letterSpacing: '0',
                padding: '0 3px',
                lineHeight: 1,
              }}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsOpen((v) => !v)}
            className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-current transition hover:bg-mori/5 md:hidden ${light ? "text-shiro" : "text-sumi"}`}
          >
            <span className="absolute h-0.5 w-6 rotate-0 bg-current transition duration-300" />
            <span className="absolute h-0.5 w-6 bg-current transition duration-300" />
            <span className="absolute h-0.5 w-6 translate-y-2 bg-current transition duration-300" />
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
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
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block transition hover:text-mori"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 text-sm text-sumi/75">
                <span>hello@katachi.store</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
