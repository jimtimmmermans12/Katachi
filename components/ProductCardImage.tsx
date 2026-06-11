'use client';

import { shopifyImg } from '@/lib/img';
import type { ShopifyProduct } from '@/lib/shopify';

// Crossfades to the product's second image on hover (parent needs `group` class).
// Products with a single image keep the plain zoom.
export default function ProductCardImage({
  product,
  width = 800,
  eager = false,
}: {
  product: ShopifyProduct;
  width?: number;
  eager?: boolean;
}) {
  const featured = product.featuredImage;
  if (!featured?.url) return null;

  const hoverImage =
    (product.images?.edges?.map((e) => e.node) ?? []).find(
      (img) => img.url !== featured.url,
    ) ?? null;

  return (
    <div className="relative h-full w-full">
      <img
        src={shopifyImg(featured.url, width)}
        alt={featured.altText ?? product.title}
        loading={eager ? undefined : 'lazy'}
        className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
          hoverImage ? 'group-hover:opacity-0' : ''
        }`}
      />
      {hoverImage && (
        <img
          src={shopifyImg(hoverImage.url, width)}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-500 group-hover:opacity-100"
        />
      )}
    </div>
  );
}
