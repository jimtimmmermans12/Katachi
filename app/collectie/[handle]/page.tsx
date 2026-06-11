'use client';

import { use, useEffect, useRef, useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';

type GalleryImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  image?: { url: string; altText: string | null } | null;
  metafield?: {
    references: {
      edges: { node: { image: GalleryImage } }[];
    };
  } | null;
};

type Product = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: { node: { url: string; altText: string | null } }[] };
  variants: { edges: { node: Variant }[] };
};

function getGalleryForVariant(variant: Variant, productImages: { url: string; altText: string | null }[]): GalleryImage[] {
  // Priority 1: variant metafield gallery
  const refs = variant.metafield?.references?.edges ?? [];
  if (refs.length > 0) {
    return refs.map((e) => e.node.image);
  }
  // Priority 2: variant's own image
  if (variant.image?.url) {
    return [{ url: variant.image.url, altText: variant.image.altText, width: 0, height: 0 }];
  }
  // Priority 3: product-level images
  if (productImages.length > 0) {
    return productImages.map((img) => ({ url: img.url, altText: img.altText, width: 0, height: 0 }));
  }
  return [];
}

// ── Slider ──────────────────────────────────────────────────────────────────

const SLIDER_CSS = `
  /* Thumbnail base */
  .ks-thumb {
    opacity: 0.38;
    transition: opacity 0.22s ease, border-color 0.22s ease;
    border-bottom: 2px solid transparent;
  }
  .ks-thumb-active {
    opacity: 1;
    border-bottom: 2px solid rgba(44,44,44,0.42);
  }
  /* Hover lift — desktop only */
  @media (hover: hover) {
    .ks-thumb:not(.ks-thumb-active):hover {
      opacity: 1;
    }
  }
  /* Hide scrollbar on thumbnail strip */
  .ks-thumbstrip::-webkit-scrollbar { display: none; }
`;

function ImageSlider({ images, title }: { images: GalleryImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Reset to first image whenever the image set changes (variant switch)
  useEffect(() => { setActive(0); }, [images]);

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
      <div style={{ width: '100%', aspectRatio: '4/3', background: '#e8e3db', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-noto-serif-jp)', fontSize: '6rem', color: 'rgba(44,44,44,0.08)' }}>形</span>
      </div>
    );
  }

  return (
    <div style={{ userSelect: 'none' }}>
      <style>{SLIDER_CSS}</style>

      {/* ── Main image area: 4:3 container, all images stacked for crossfade ── */}
      <div
        style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#f0ece6', overflow: 'hidden' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => (
          <img
            key={img.url}
            src={img.url}
            alt={img.altText ?? title}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: i === active ? 1 : 0,
              transition: 'opacity 0.3s ease',
              // Ensure active image is on top when both are mid-transition
              zIndex: i === active ? 1 : 0,
            }}
          />
        ))}
      </div>

      {/* ── Thumbnail strip — only when 2+ images ── */}
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
                src={img.url}
                alt={img.altText ?? `${title} ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Progress dashes — subtle count indicator ── */}
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

// ── Page ────────────────────────────────────────────────────────────────────

export default function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'found' | 'notfound'>('loading');
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const { addToCart, isLoading: cartLoading } = useCart();

  useEffect(() => {
    fetch(`/api/test-product?handle=${encodeURIComponent(handle)}`)
      .then((r) => {
        if (r.status === 404) { setStatus('notfound'); return null; }
        if (!r.ok) throw new Error('fetch failed');
        return r.json();
      })
      .then((data: Product | null) => {
        if (data) {
          setProduct(data);
          const firstVariant = data.variants?.edges?.[0]?.node;
          setSelectedVariantId(firstVariant?.id ?? null);
          setStatus('found');
        }
      })
      .catch(() => setStatus('notfound'));
  }, [handle]);

  const handleAddToCart = async () => {
    if (!selectedVariantId || cartLoading) return;
    await addToCart(selectedVariantId, 1);
    // Cart drawer opens automatically via context
  };

  const cartLabel = cartLoading ? 'Adding...' : 'Add to cart';

  if (status === 'loading') {
    return (
      <div style={{ background: '#faf9f7', minHeight: '100vh' }}>
        <Nav />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.4)' }}>
            Loading
          </p>
        </div>
      </div>
    );
  }

  if (status === 'notfound' || !product) {
    return (
      <div style={{ background: '#faf9f7', minHeight: '100vh' }}>
        <Nav />
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
          <p style={{ fontFamily: 'var(--font-noto-serif-jp)', fontSize: '5rem', color: 'rgba(44,44,44,0.07)' }}>形</p>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.4)' }}>
            Product not found
          </p>
          <a href="/collectie" style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.55)', textDecoration: 'none' }}>
            ← Back to collection
          </a>
        </div>
      </div>
    );
  }

  const variants = product.variants?.edges?.map((e) => e.node) ?? [];
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const productImages = product.images?.edges?.map((e) => e.node) ?? [];
  const galleryImages = selectedVariant ? getGalleryForVariant(selectedVariant, productImages) : [];

  const price = product.priceRange?.minVariantPrice;
  const amount = price?.amount
    ? new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: price.currencyCode ?? 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(price.amount))
    : null;

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh' }}>
      <Nav />

      <main style={{ paddingTop: '88px' }}>

        {/* Breadcrumb */}
        <div style={{ borderBottom: '1px solid rgba(44,44,44,0.1)', padding: '16px 24px' }}>
          <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.5)', margin: 0 }}>
            <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Katachi</a>
            <span style={{ margin: '0 10px' }}>—</span>
            <a href="/collectie" style={{ color: 'inherit', textDecoration: 'none' }}>Collection</a>
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
                Gratis verzending vanaf € 100 · Retourneren binnen 30 dagen
              </p>

              {/* Rule */}
              <div style={{ height: '1px', background: 'rgba(44,44,44,0.07)', margin: '36px 0' }} />

              {/* Material details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Material', value: 'Stoneware, natural glaze' },
                  { label: 'Origin', value: 'Handcrafted in Japan' },
                  { label: 'Care', value: 'Hand wash recommended' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.4)' }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '12px', color: 'rgba(44,44,44,0.65)', letterSpacing: '0.05em' }}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Product reference */}
              <p style={{ fontFamily: 'var(--font-dm-sans)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(44,44,44,0.22)', margin: '36px 0 0' }}>
                Ref. KTC-{handle.toUpperCase().slice(0, 8)}
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
      </main>

      <Footer />
    </div>
  );
}
