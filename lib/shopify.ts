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

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  priceRange: {
    minVariantPrice: ShopifyMoney;
  };
  featuredImage: ShopifyImage | null;
};

type GraphQLResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

const STOREFRONT_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2025-01/graphql.json`;

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(STOREFRONT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token":
        process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
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
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

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

export function formatPrice(money: ShopifyMoney): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: money.currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(money.amount));
}
