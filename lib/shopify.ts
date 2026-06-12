// Shopify Storefront API client — server-only (never imported by "use client" files)
import { MOCK_PRODUCTS } from "./mockProducts";

export type ShopifyImage = {
  url: string;
  altText: string | null;
};

export type ShopifyMoney = {
  amount: string;
  currencyCode: string;
};

export type ShopifyGalleryImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  image?: ShopifyImage | null;
  metafield?: {
    references: {
      edges: { node: { image: ShopifyGalleryImage } }[];
    };
  } | null;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  productType: string;
  vendor?: string;
  tags?: string[];
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyMoney;
  };
  featuredImage: ShopifyImage | null;
  images?: {
    edges: { node: ShopifyImage & { width?: number; height?: number } }[];
  };
  variants?: {
    edges: { node: ShopifyVariant }[];
  };
};

type GraphQLResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

function credentials() {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ??
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token =
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ??
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  return { domain, token };
}

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const { domain, token } = credentials();
  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token!,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Shopify API responded with ${res.status}: ${res.statusText}`);
  }

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  return json.data;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 3) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

type ProductsQueryData = {
  products: {
    edges: { node: ShopifyProduct }[];
  };
};

export async function getProducts(count = 24): Promise<ShopifyProduct[]> {
  const { domain, token } = credentials();

  if (!domain || !token || token === "your_storefront_access_token_here") {
    return MOCK_PRODUCTS.slice(0, count);
  }

  try {
    const data = await shopifyFetch<ProductsQueryData>(PRODUCTS_QUERY, {
      first: count,
    });
    return data.products.edges.map((edge) => edge.node);
  } catch (err) {
    console.error("Failed to fetch Shopify products, falling back to mock data:", err);
    return MOCK_PRODUCTS.slice(0, count);
  }
}

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      productType
      vendor
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
      }
      images(first: 6) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            metafield(namespace: "custom", key: "gallery") {
              references(first: 20) {
                edges {
                  node {
                    ... on MediaImage {
                      image {
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

type ProductByHandleData = {
  product: ShopifyProduct | null;
};

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const { domain, token } = credentials();

  if (!domain || !token || token === "your_storefront_access_token_here") {
    const mock = MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null;
    if (mock) {
      return {
        ...mock,
        descriptionHtml: `<p>${mock.description}</p>`,
      };
    }
    return null;
  }

  try {
    const data = await shopifyFetch<ProductByHandleData>(
      PRODUCT_BY_HANDLE_QUERY,
      { handle }
    );
    return data.product;
  } catch (err) {
    console.error("Failed to fetch product by handle:", err);
    return null;
  }
}

export function formatPrice(money: ShopifyMoney): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(money.amount));
}
