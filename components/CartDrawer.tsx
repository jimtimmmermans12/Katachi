'use client';

import { useCart } from '@/contexts/CartContext';
import type { CartLineItem } from '@/contexts/CartContext';

export default function CartDrawer() {
  const { cart, isOpen, isLoading, closeDrawer, removeFromCart, updateQuantity } = useCart();

  const lines = cart?.lines ?? [];
  const total = cart?.cost?.totalAmount;
  const formattedTotal = total
    ? new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: total.currencyCode,
        minimumFractionDigits: 2,
      }).format(parseFloat(total.amount))
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(44,44,44,0.35)',
          backdropFilter: 'blur(2px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-label="Shopping cart"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 70,
          width: '100%', maxWidth: '460px',
          background: 'var(--shiro, #F7F5F2)',
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-32px 0 80px rgba(44,44,44,0.08)',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          padding: '28px 28px 22px',
          borderBottom: '1px solid rgba(44,44,44,0.09)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
            <h2 style={{
              fontFamily: 'var(--font-cormorant-garamond), Georgia, serif',
              fontSize: '1.5rem', fontWeight: 400, letterSpacing: '0.01em',
              color: '#1a1a1a', margin: 0,
            }}>
              Your selection
            </h2>
            {(cart?.totalQuantity ?? 0) > 0 && (
              <span style={{
                fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(44,44,44,0.4)',
              }}>
                {cart!.totalQuantity} {cart!.totalQuantity === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px', color: 'rgba(44,44,44,0.4)',
              display: 'flex', alignItems: 'center',
              transition: 'color 0.15s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 1L15 15M15 1L1 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Line items ── */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {lines.length === 0 ? (
            <EmptyState onClose={closeDrawer} />
          ) : (
            lines.map((line) => (
              <LineItem
                key={line.id}
                line={line}
                isLoading={isLoading}
                onRemove={removeFromCart}
                onQuantity={updateQuantity}
              />
            ))
          )}
        </div>

        {/* ── Footer ── */}
        {lines.length > 0 && (
          <div style={{
            flexShrink: 0,
            borderTop: '1px solid rgba(44,44,44,0.09)',
            padding: '24px 28px 32px',
            background: 'var(--shiro, #F7F5F2)',
          }}>
            {/* Subtotal */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              marginBottom: '22px',
            }}>
              <span style={{
                fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
                letterSpacing: '0.28em', textTransform: 'uppercase',
                color: 'rgba(44,44,44,0.45)',
              }}>
                Subtotal
              </span>
              <span style={{
                fontFamily: 'var(--font-cormorant-garamond), Georgia, serif',
                fontSize: '1.5rem', fontWeight: 400, color: '#1a1a1a',
              }}>
                {formattedTotal}
              </span>
            </div>

            {/* Checkout CTA */}
            <a
              href={cart!.checkoutUrl}
              style={{
                display: 'block', width: '100%', textAlign: 'center',
                background: '#1a1a1a', color: '#F7F5F2',
                padding: '16px 24px',
                fontFamily: 'var(--font-dm-sans)', fontSize: '11px', fontWeight: 500,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              Checkout
            </a>

            {/* Continue shopping */}
            <button
              type="button"
              onClick={closeDrawer}
              style={{
                display: 'block', width: '100%', textAlign: 'center',
                marginTop: '12px', background: 'none', border: 'none',
                cursor: 'pointer', padding: '8px',
                fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(44,44,44,0.4)',
                transition: 'color 0.15s',
              }}
            >
              Continue shopping
            </button>

            <p style={{
              textAlign: 'center', marginTop: '16px',
              fontFamily: 'var(--font-dm-sans)', fontSize: '9px',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(44,44,44,0.25)',
            }}>
              Gratis verzending vanaf € 100 · Retourneren binnen 30 dagen
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 28px', gap: '14px',
    }}>
      <span style={{
        fontFamily: 'var(--font-noto-serif-jp)', fontSize: '3rem',
        color: 'rgba(44,44,44,0.07)',
      }}>
        形
      </span>
      <p style={{
        fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
        letterSpacing: '0.28em', textTransform: 'uppercase',
        color: 'rgba(44,44,44,0.35)', margin: 0, textAlign: 'center',
      }}>
        Your selection is empty
      </p>
      <button
        type="button"
        onClick={onClose}
        style={{
          marginTop: '6px', background: 'none', border: 'none',
          cursor: 'pointer', padding: '6px 0',
          fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(44,44,44,0.45)',
          textDecoration: 'underline', textUnderlineOffset: '4px',
        }}
      >
        Continue shopping
      </button>
    </div>
  );
}

function LineItem({
  line,
  isLoading,
  onRemove,
  onQuantity,
}: {
  line: CartLineItem;
  isLoading: boolean;
  onRemove: (id: string) => void;
  onQuantity: (id: string, qty: number) => void;
}) {
  const imgSrc =
    line.merchandise.image?.url ??
    line.merchandise.product.featuredImage?.url;

  const lineTotal = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: line.cost.totalAmount.currencyCode,
    minimumFractionDigits: 2,
  }).format(parseFloat(line.cost.totalAmount.amount));

  const showVariant =
    line.merchandise.title && line.merchandise.title !== 'Default Title';

  return (
    <div style={{
      display: 'flex', gap: '16px',
      padding: '20px 28px',
      borderBottom: '1px solid rgba(44,44,44,0.07)',
    }}>
      {/* Thumbnail */}
      <div style={{
        flexShrink: 0, width: '76px', height: '76px',
        background: '#e8e3db', overflow: 'hidden',
      }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={line.merchandise.product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-noto-serif-jp)', fontSize: '1.25rem', color: 'rgba(44,44,44,0.1)' }}>形</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Title */}
        <p style={{
          fontFamily: 'var(--font-cormorant-garamond), Georgia, serif',
          fontSize: '1.05rem', fontWeight: 400, color: '#1a1a1a',
          margin: 0, lineHeight: 1.25,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {line.merchandise.product.title}
        </p>

        {/* Variant */}
        {showVariant && (
          <p style={{
            fontFamily: 'var(--font-dm-sans)', fontSize: '9px',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(44,44,44,0.4)', margin: 0,
          }}>
            {line.merchandise.title}
          </p>
        )}

        {/* Controls row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginTop: 'auto',
        }}>
          {/* Qty stepper */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StepBtn
              label="−"
              onClick={() => onQuantity(line.id, line.quantity - 1)}
              disabled={isLoading}
            />
            <span style={{
              width: '34px', height: '28px',
              borderTop: '1px solid rgba(44,44,44,0.18)',
              borderBottom: '1px solid rgba(44,44,44,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: '#1a1a1a',
            }}>
              {line.quantity}
            </span>
            <StepBtn
              label="+"
              onClick={() => onQuantity(line.id, line.quantity + 1)}
              disabled={isLoading}
            />
          </div>

          {/* Price + remove */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{
              fontFamily: 'var(--font-dm-sans)', fontSize: '12px',
              color: '#1a1a1a', letterSpacing: '0.02em',
            }}>
              {lineTotal}
            </span>
            <button
              type="button"
              onClick={() => onRemove(line.id)}
              disabled={isLoading}
              aria-label="Remove item"
              style={{
                background: 'none', border: 'none',
                cursor: isLoading ? 'wait' : 'pointer',
                padding: '4px', color: 'rgba(44,44,44,0.3)',
                display: 'flex', transition: 'color 0.15s',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '28px', height: '28px',
        border: '1px solid rgba(44,44,44,0.18)', borderRadius: 0,
        background: 'none', cursor: disabled ? 'wait' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#1a1a1a', fontSize: '14px', lineHeight: 1,
        fontFamily: 'var(--font-dm-sans)',
        transition: 'background 0.15s',
      }}
    >
      {label}
    </button>
  );
}
