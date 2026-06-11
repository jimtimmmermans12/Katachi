'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('subscribe failed');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="border-t border-slate-200/60 px-8 py-24 sm:px-12 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          <p className="font-display text-xs uppercase tracking-[0.35em] text-sumi/50">
            Quiet letters
          </p>
          <p className="mt-6 font-display text-3xl leading-[1.4] text-sumi/85 sm:text-4xl">
            A letter, occasionally.<br />Objects, ideas, stillness.
          </p>

          {status === 'done' ? (
            <p className="mt-12 font-display text-lg italic text-sumi/60">
              Thank you. The first letter will find you soon.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-12 flex max-w-md items-end gap-4"
            >
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border-b border-slate-300 bg-transparent pb-3 pt-1 text-center text-base text-sumi placeholder:text-sumi/30 focus:border-sumi focus:outline-none transition-colors duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                aria-label="Subscribe"
                className="pb-3 text-sumi/60 transition hover:text-sumi disabled:opacity-40"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11h16M13 5l6 6-6 6" />
                </svg>
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-6 text-sm text-red-700/70">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="mt-10 text-[10px] uppercase tracking-[0.22em] text-sumi/30">
            No noise. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
