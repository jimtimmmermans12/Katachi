// Mock product data — used automatically when SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set.
// Delete this file (and the import in shopify.ts) once real Shopify credentials are in .env.local.

import type { ShopifyProduct } from "./shopify";

const price = (amount: string) => ({
  minVariantPrice: { amount, currencyCode: "EUR" },
});

const image = (path: string): any => ({
  url: path,
  altText: path.split("/").pop()?.replace(".svg", ""),
});

export const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/1",
    title: "HIKARI MISKA",
    handle: "hikari-miska",
    description: "Handcrafted stoneware with soft glaze and a quiet, warm presence.",
    productType: "Ceramics",
    priceRange: price("98.00"),
    featuredImage: image("/products/hikari-miska.svg"),
  },
  {
    id: "gid://shopify/Product/2",
    title: "KAZE SAKE SET",
    handle: "kaze-sake-set",
    description: "Soft matte porcelain for table ceremonies — two cups, one carafe.",
    productType: "Ceramics",
    priceRange: price("124.00"),
    featuredImage: image("/products/kaze-sake-set.svg"),
  },
  {
    id: "gid://shopify/Product/3",
    title: "TSUKI SCHENKKAN",
    handle: "tsuki-schenkkan",
    description: "Asymmetrisch steengoed met ijzeroxideglazuur en een stevige, warme greep.",
    productType: "Ceramics",
    priceRange: price("89.00"),
    featuredImage: image("/products/tsuki-schenkkan.svg"),
  },
  {
    id: "gid://shopify/Product/4",
    title: "SUMI TRAY",
    handle: "sumi-tray",
    description: "Zwart gelakt mangohout met strak silhouet en subtiele houtskooldetails.",
    productType: "Wood",
    priceRange: price("84.00"),
    featuredImage: image("/products/sumi-tray.svg"),
  },
  {
    id: "gid://shopify/Product/5",
    title: "SHIZEN SCHAAL",
    handle: "shizen-schaal",
    description: "Onbehandeld esdoorn met zichtbare nerf, licht en onverwacht duurzaam.",
    productType: "Wood",
    priceRange: price("67.00"),
    featuredImage: image("/products/shizen-schaal.svg"),
  },
  {
    id: "gid://shopify/Product/6",
    title: "ORI PLACEMAT",
    handle: "ori-placemat",
    description: "Dubbel geweven linnen in ongebleekte toon, eenvoudig en tijdloos.",
    productType: "Linen",
    priceRange: price("38.00"),
    featuredImage: image("/products/ori-placemat.svg"),
  },
  {
    id: "gid://shopify/Product/7",
    title: "NAMI BESTEK",
    handle: "nami-bestek",
    description: "Geborsteld messing, met de hand gebalanceerd voor dagelijks gebruik.",
    productType: "Metal",
    priceRange: price("112.00"),
    featuredImage: image("/products/nami-bestek.svg"),
  },
  {
    id: "gid://shopify/Product/8",
    title: "FURO KAARSENHOUDER",
    handle: "furo-kaarsenhouder",
    description: "Geslagen koper met matte afwerking — bestand tegen tijd en licht.",
    productType: "Metal",
    priceRange: price("74.00"),
    featuredImage: image("/products/furo-kaarsenhouder.svg"),
  },
];
