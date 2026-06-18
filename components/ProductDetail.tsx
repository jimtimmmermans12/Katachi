'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { shopifyImg } from '@/lib/img';
import type {
  ProductSpecs,
  ShopifyGalleryImage,
  ShopifyProduct,
  ShopifyVariant,
} from '@/lib/shopify';

function getGalleryForVariant(
  variant: ShopifyVariant,
  productImages: { url: string; altText: string | null }[],
): ShopifyGalleryImage[] {
  // Gallery priority order:
  // 1. The variant's "Gallery" metafield, if it has images (existing products).
  // 2. Otherwise all of the product's standard Media images (products without a
  //    Gallery metafield, e.g. single-variant ones like the Nagomi teapot — this
  //    must come before the single variant image so the whole Media set shows,
  //    not just the default variant's one image).
  // 3. Otherwise the single variant image, as a last resort.
  // 4. Otherwise nothing.
  const refs = variant.metafield?.references?.edges ?? [];
  if (refs.length > 0) {
    return refs.map((e) => e.node.image);
  }
  if (productImages.length > 0) {
    return productImages.map((img) => ({ url: img.url, altText: img.altText, width: 0, height: 0 }));
  }
  if (variant.image?.url) {
    return [{ url: variant.image.url, altText: variant.image.altText, width: 0, height: 0 }];
  }
  return [];
}

// ── Slider ──────────────────────────────────────────────────────────────────

const SLIDER_CSS = `
  .ks-thumb {
    opacity: 0.38;
    transition: opacity 0.22s ease, border-color 0.22s ease;
    border-bottom: 2px solid transparent;
  }
  .ks-thumb-active {
    opacity: 1;
    border-bottom: 2px solid rgba(44,44,44,0.42);
  }
  @media (hover: hover) {
    .ks-thumb:not(.ks-thumb-active):hover {
      opacity: 1;
    }
  }
  .ks-thumbstrip::-webkit-scrollbar { display: none; }
`;

function ImageSlider({ images, title }: { images: ShopifyGalleryImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Cursor-following zoom — desktop (hover-capable) only
  const [canHover, setCanHover] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  useEffect(() => { setActive(0); setZoomed(false); }, [images]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (images.length === 0) {
    return (
      <div style={{ width: '100%', aspectRatio: '4/5', background: '#e8e3db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-noto-serif-jp)', fontSize: '6rem', color: 'rgba(44,44,44,0.08)' }}>形</span>
      </div>
    );
  }

  return (
    <div style={{ userSelect: 'none' }}>
      <style>{SLIDER_CSS}</style>

      {/* Main image area: 4:5 container, all images stacked for crossfade */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4/5',
          background: '#f0ece6',
          overflow: 'hidden',
          cursor: canHover ? (zoomed ? 'zoom-out' : 'zoom-in') : undefined,
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseEnter={() => canHover && setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={onMouseMove}
      >
        {images.map((img, i) => (
          <img
            key={img.url}
            src={shopifyImg(img.url, 1600)}
            alt={img.altText ?? title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === active ? 1 : 0,
              transition: 'opacity 0.3s ease, transform 0.35s ease',
              zIndex: i === active ? 1 : 0,
              transform: zoomed && i === active ? 'scale(1.8)' : 'scale(1)',
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          />
        ))}
      </div>

      {/* Thumbnail strip — only when 2+ images */}
      {images.length > 1 && (
        <div
          className="ks-thumbstrip"
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: '4px',
          }}
        >
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`ks-thumb${i === active ? ' ks-thumb-active' : ''}`}
              style={{
                flexShrink: 0,
                width: '84px',
                height: '84px',
                padding: 0,
                margin: 0,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                display: 'block',
              }}
            >
              <img
                src={shopifyImg(img.url, 200)}
                alt={img.altText ?? `${title} ${i + 1}`}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Progress dashes */}
      {images.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '5px',
          marginTop: '14px',
          paddingLeft: '2px',
        }}>
          {images.map((_, i) => (
            <div
              key={i}
              style={{
                height: '1px',
                width: i === active ? '24px' : '12px',
                background: i === active ? 'rgba(44,44,44,0.55)' : 'rgba(44,44,44,0.18)',
                transition: 'width 0.25s ease, background 0.25s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Detail ──────────────────────────────────────────────────────────────────

export default function ProductDetail({
  product,
  related = [],
  specs,
}: {
  product: ShopifyProduct;
  related?: ShopifyProduct[];
  specs: ProductSpecs;
}) {
  const variants = product.variants?.edges?.map((e) => e.node) ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const { addToCart, isLoading: cartLoading } = useCart();

  // Sticky mobile bar: visible only while the main button is off-screen
  const mainBtnRef = useRef<HTMLButtonElement | null>(null);
  const [mainBtnVisible, setMainBtnVisible] = useState(true);

  useEffect(() => {
    const el = mainBtnRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setMainBtnVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = async () => {
    if (!selectedVariantId || cartLoading) return;
    await addToCart(selectedVariantId, 1);
  };

  const cartLabel = cartLoading ? 'Adding...' : 'Add to cart';

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const productImages = product.images?.edges?.map((e) => e.node) ?? [];
  const galleryImages = selectedVariant ? getGalleryForVariant(selectedVariant, productImages) : [];

  const price = selectedVariant?.price ?? product.priceRange?.minVariantPrice;
  const amount = price?.amount
    ? new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: price.currencyCode ?? 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(price.amount))
    : null;

  // Spec block — units live here so Shopify metafields stay plain numbers.
  // A null value falls back to a unit-bearing placeholder the merchant can fill in.
  const specRows: { label: string; value: string | null; placeholder: string }[] = [
    { label: 'Material', value: specs.material, placeholder: '—' },
    { label: 'Dimensions', value: specs.diameter ? `⌀ ${specs.diameter} cm` : null, placeholder: '⌀ — cm' },
    { label: 'Capacity', value: specs.capacity ? `${specs.capacity} ml` : null, placeholder: '— ml' },
    { label: 'Weight', value: specs.weight ? `${specs.weight} g` : null, placeholder: '— g' },
    { label: 'Care', value: specs.care, placeholder: '—' },
  ];

  return (
    <div style={{ background: 'var(--shiro, #F7F5F2)', minHeight: '100vh' }}>
      <Nav />

      <main style={{ paddingTop: '88px' }}>

        {/* Breadcrumb */}
        <div style={{ borderBottom: '1px solid rgba(44,44,44,0.1)', padding: '16px 24px' }}>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.5)', margin: 0 }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Katachi</Link>
            <span style={{ margin: '0 10px' }}>—</span>
            <Link href="/collectie" style={{ color: 'inherit', textDecoration: 'none' }}>Collection</Link>
            <span style={{ margin: '0 10px' }}>—</span>
            <span style={{ color: 'rgba(44,44,44,0.85)' }}>{product.title}</span>
          </p>
        </div>

        {/* Product layout */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:min-h-[80vh]">

          {/* Image column — slider */}
          <div className="w-full lg:w-1/2 lg:flex-shrink-0 lg:sticky lg:top-[88px]">
            <ImageSlider images={galleryImages} title={product.title} />
          </div>

          {/* Product details column */}
          <div className="w-full lg:w-1/2" style={{ padding: '40px 24px 60px', display: 'flex', flexDirection: 'column' }}>
            <div className="lg:px-12 lg:pt-16 lg:pb-20" style={{ display: 'flex', flexDirection: 'column' }}>

              {/* Category */}
              {(product.productType || product.vendor) && (
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.45)', margin: '0 0 16px' }}>
                  {product.productType || product.vendor}
                </p>
              )}

              {/* Title */}
              <h1 style={{ fontFamily: 'var(--font-cormorant-garamond), Georgia, serif', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#1a1a1a', margin: '0 0 8px' }}>
                {product.title}
              </h1>

              {/* Japanese accent */}
              <p style={{ fontFamily: 'var(--font-noto-serif-jp), serif', fontSize: '0.85rem', color: 'rgba(44,44,44,0.25)', margin: '0 0 28px', letterSpacing: '0.12em' }}>
                形のある静寂
              </p>

              {/* Rule */}
              <div style={{ height: '1px', background: 'rgba(44,44,44,0.1)', margin: '0 0 28px' }} />

              {/* Price */}
              {amount && (
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '1rem', letterSpacing: '0.12em', color: '#1a1a1a', margin: '0 0 16px' }}>
                  {amount}
                </p>
              )}

              {/* Description */}
              {product.descriptionHtml && (
                <div
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '0.875rem', lineHeight: 1.9, color: 'rgba(44,44,44,0.75)', margin: '0 0 20px', maxWidth: '480px' }}
                />
              )}

              {/* Spec block */}
              <div style={{ margin: '0 0 24px' }}>
                <div style={{ height: '1px', background: 'rgba(44,44,44,0.1)', margin: '0 0 24px' }} />
                <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.45)', margin: '0 0 14px' }}>
                  Details
                </p>
                <dl style={{ margin: 0, maxWidth: '480px' }}>
                  {specRows.map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 1fr',
                        gap: '16px',
                        padding: '9px 0',
                        borderBottom: '1px solid rgba(44,44,44,0.06)',
                      }}
                    >
                      <dt style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.45)', lineHeight: 1.7, margin: 0 }}>
                        {row.label}
                      </dt>
                      <dd style={{ margin: 0, fontFamily: 'var(--font-dm-sans)', fontSize: '0.8125rem', letterSpacing: '0.02em', lineHeight: 1.7, color: row.value ? 'rgba(44,44,44,0.85)' : 'rgba(44,44,44,0.3)' }}>
                        {row.value ?? row.placeholder}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Variant selector */}
              {variants.length > 1 && (
                <div style={{ margin: '0 0 20px' }}>
                  <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.45)', margin: '0 0 12px' }}>
                    Variant
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {variants.map((v) => {
                      const isSelected = v.id === selectedVariantId;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          disabled={!v.availableForSale}
                          style={{
                            height: '40px',
                            padding: '0 20px',
                            border: isSelected ? '1px solid #1a1a1a' : '1px solid rgba(44,44,44,0.2)',
                            borderRadius: 0,
                            background: isSelected ? '#1a1a1a' : 'transparent',
                            color: isSelected ? '#ffffff' : '#1a1a1a',
                            fontFamily: 'var(--font-dm-sans)',
                            fontSize: '11px',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            cursor: v.availableForSale ? 'pointer' : 'not-allowed',
                            opacity: v.availableForSale ? 1 : 0.35,
                            transition: 'all 0.2s',
                          }}
                        >
                          {v.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rule */}
              <div style={{ height: '1px', background: 'rgba(44,44,44,0.1)', margin: '0 0 32px' }} />

              {/* Add to cart */}
              <button
                ref={mainBtnRef}
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedVariantId || cartLoading}
                style={{
                  width: '100%',
                  height: '52px',
                  background: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 0,
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: cartLoading ? 'wait' : 'pointer',
                  opacity: (!selectedVariantId || cartLoading) ? 0.65 : 1,
                  transition: 'opacity 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cartLabel}
              </button>

              {/* Shipping note */}
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.38)', margin: '16px 0 0', textAlign: 'center' }}>
                Free shipping from €100 · 30-day returns
              </p>

              {/* Product reference */}
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.22)', margin: '36px 0 0' }}>
                Ref. KTC-{product.handle.toUpperCase().slice(0, 8)}
              </p>
            </div>
          </div>
        </div>

        {/* Editorial strip */}
        <div style={{ borderTop: '1px solid rgba(44,44,44,0.1)', borderBottom: '1px solid rgba(44,44,44,0.1)', padding: '48px 24px', background: 'rgba(255,255,255,0.5)' }}>
          <p style={{ fontFamily: 'var(--font-cormorant-garamond), Georgia, serif', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 300, fontStyle: 'italic', letterSpacing: '0.01em', color: 'rgba(44,44,44,0.55)', maxWidth: '680px', margin: '0 auto', textAlign: 'center', lineHeight: 1.6 }}>
            "Objects earn their place through quiet usefulness and the beauty of honest material."
          </p>
        </div>

        {/* You may also like */}
        {related.length > 0 && (
          <div style={{ padding: '64px 24px 80px', maxWidth: '880px', margin: '0 auto' }}>
            <p style={{
              fontFamily: 'var(--font-dm-sans)', fontSize: '10px',
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'rgba(44,44,44,0.45)', margin: '0 0 32px', textAlign: 'center',
            }}>
              You may also like
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}>
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/collectie/${p.handle}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                  className="group"
                >
                  <div style={{ aspectRatio: '4/5', background: '#e8e3db', overflow: 'hidden' }}>
                    {p.featuredImage?.url ? (
                      <img
                        src={shopifyImg(p.featuredImage.url, 800)}
                        alt={p.featuredImage.altText ?? p.title}
                        loading="lazy"
                        className="transition duration-500 group-hover:scale-105"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-noto-serif-jp)', fontSize: '2rem', color: 'rgba(44,44,44,0.1)' }}>形</span>
                      </div>
                    )}
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-cormorant-garamond), Georgia, serif',
                    fontSize: '1.15rem', fontWeight: 400, color: '#1a1a1a',
                    margin: '14px 0 4px', lineHeight: 1.3,
                  }}>
                    {p.title}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-dm-sans)', fontSize: '12px',
                    letterSpacing: '0.08em', color: 'rgba(44,44,44,0.55)', margin: 0,
                  }}>
                    {new Intl.NumberFormat('nl-NL', {
                      style: 'currency',
                      currency: p.priceRange.minVariantPrice.currencyCode,
                      minimumFractionDigits: 2,
                    }).format(parseFloat(p.priceRange.minVariantPrice.amount))}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sticky add-to-cart bar — mobile only, hidden while main button is on-screen */}
      <div
        className="md:hidden"
        aria-hidden={mainBtnVisible}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
          background: 'rgba(247,245,242,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(44,44,44,0.1)',
          transform: mainBtnVisible ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease',
          pointerEvents: mainBtnVisible ? 'none' : 'auto',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            fontFamily: 'var(--font-cormorant-garamond), Georgia, serif',
            fontSize: '1rem', fontWeight: 400, color: '#1a1a1a',
            margin: 0, lineHeight: 1.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {product.title}
          </p>
          {amount && (
            <p style={{
              fontFamily: 'var(--font-dm-sans)', fontSize: '11px',
              letterSpacing: '0.1em', color: 'rgba(44,44,44,0.6)',
              margin: '2px 0 0',
            }}>
              {amount}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedVariantId || cartLoading}
          style={{
            flexShrink: 0,
            height: '44px',
            padding: '0 22px',
            background: '#1a1a1a',
            color: '#ffffff',
            border: 'none',
            borderRadius: 0,
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: cartLoading ? 'wait' : 'pointer',
            opacity: (!selectedVariantId || cartLoading) ? 0.65 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {cartLabel}
        </button>
      </div>

      <Footer />
    </div>
  );
}
