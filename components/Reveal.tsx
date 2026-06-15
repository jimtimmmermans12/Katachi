'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';

type RevealProps = {
  children: ReactNode;
  /** Element to render. Defaults to a div. Use for semantics (article/section/footer). */
  as?: ElementType;
  className?: string;
  /** Stagger delay in ms — pass index * 50 for a calm cascade between siblings. */
  delay?: number;
  /** Animate on mount instead of waiting for scroll (use for above-the-fold hero content). */
  immediate?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  id?: string;
};

/**
 * Subtle scroll-reveal: opacity 0→1, translateY 20px→0 over 0.6s ease-out.
 * Uses IntersectionObserver (no library); the actual transition lives in
 * globals.css (.reveal / .is-visible), which also disables it under
 * prefers-reduced-motion. Each element only reveals once.
 */
export default function Reveal({
  children,
  as,
  className = '',
  delay = 0,
  immediate = false,
  onClick,
  style,
  id,
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (immediate) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Graceful fallback for environments without IntersectionObserver.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [immediate]);

  return (
    <Tag
      ref={ref}
      id={id}
      onClick={onClick}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}
