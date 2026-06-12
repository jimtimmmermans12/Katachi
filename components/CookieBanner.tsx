'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'katachi_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const choose = (value: 'accepted' | 'declined') => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 55,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px 28px',
        padding: '18px 24px calc(18px + env(safe-area-inset-bottom))',
        background: 'rgba(247,245,242,0.97)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(44,44,44,0.12)',
      }}
    >
      <p style={{
        fontFamily: 'var(--font-dm-sans)',
        fontSize: '12px',
        lineHeight: 1.6,
        color: 'rgba(44,44,44,0.75)',
        margin: 0,
        maxWidth: '520px',
      }}>
        We use only essential cookies to keep your cart working. No tracking,
        no third parties. See our{' '}
        <Link
          href="/privacy-policy"
          style={{ color: 'var(--sumi, #2C2C2C)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
        >
          privacy policy
        </Link>.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => choose('declined')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 0',
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(44,44,44,0.55)',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose('accepted')}
          style={{
            background: 'var(--sumi, #2C2C2C)',
            color: 'var(--shiro, #F7F5F2)',
            border: 'none',
            borderRadius: 0,
            cursor: 'pointer',
            padding: '12px 28px',
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
