// Shopify CDN images accept a width param for on-the-fly resizing.
export function shopifyImg(url: string, width: number): string {
  if (!url.includes("cdn.shopify.com")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}width=${width}`;
}
