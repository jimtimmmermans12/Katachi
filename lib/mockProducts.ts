// Mock product data — used automatically when SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set.
// Delete this file (and the import in shopify.ts) once real Shopify credentials are in .env.local.

import type { ShopifyProduct } from "./shopify";

const price = (amount: string) => ({
  minVariantPrice: { amount, currencyCode: "EUR" },
});

export const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: "mock-1",
    title: "Hikari Miska",
    handle: "hikari-miska",
    description: "Handcrafted stoneware with soft glaze and a quiet, warm presence.",
    productType: "Ceramics",
    priceRange: price("98.00"),
    featuredImage: null,
  },
  {
    id: "mock-2",
    title: "Kaze Sake Set",
    handle: "kaze-sake-set",
    description: "Soft matte porcelain for table ceremonies — two cups, one carafe.",
    productType: "Ceramics",
    priceRange: price("124.00"),
    featuredImage: null,
  },
  {
    id: "mock-3",
    title: "Sumi Tray",
    handle: "sumi-tray",
    description: "Black lacquered mango wood with a clean silhouette and charcoal detail.",
    productType: "Wood",
    priceRange: price("84.00"),
    featuredImage: null,
  },
  {
    id: "mock-4",
    title: "Shizen Bowl",
    handle: "shizen-bowl",
    description: "Untreated maple with visible grain — light and unexpectedly durable.",
    productType: "Wood",
    priceRange: price("67.00"),
    featuredImage: null,
  },
  {
    id: "mock-5",
    title: "Ori Placemat",
    handle: "ori-placemat",
    description: "Double-woven linen in unbleached tone, simple and timeless.",
    productType: "Linen",
    priceRange: price("38.00"),
    featuredImage: null,
  },
  {
    id: "mock-6",
    title: "Nami Cutlery",
    handle: "nami-cutlery",
    description: "Brushed brass, hand-balanced for daily use.",
    productType: "Metal",
    priceRange: price("112.00"),
    featuredImage: null,
  },
  {
    id: "mock-7",
    title: "Tsuki Carafe",
    handle: "tsuki-carafe",
    description: "Asymmetric stoneware with iron oxide glaze and a firm, warm grip.",
    productType: "Ceramics",
    priceRange: price("89.00"),
    featuredImage: null,
  },
  {
    id: "mock-8",
    title: "Furo Candleholder",
    handle: "furo-candleholder",
    description: "Hammered copper with a matte finish — built to last and hold light.",
    productType: "Metal",
    priceRange: price("74.00"),
    featuredImage: null,
  },
];
