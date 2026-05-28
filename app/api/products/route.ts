import { NextResponse } from "next/server";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

export async function GET() {
  // If no credentials, return mock products
  if (!domain || !token) {
    return NextResponse.json(MOCK_PRODUCTS);
  }

  try {
    const response = await fetch(
      `https://${domain}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({
          query: `{
            products(first: 30) {
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
          }`,
        }),
      }
    );

    if (!response.ok) {
      console.warn(`Shopify API responded with ${response.status}, using mock products`);
      return NextResponse.json(MOCK_PRODUCTS);
    }

    const data = await response.json();

    if (data.errors?.length) {
      console.warn("Shopify API errors, using mock products:", data.errors);
      return NextResponse.json(MOCK_PRODUCTS);
    }

    const products = data.data.products.edges.map((edge: any) => edge.node);
    return NextResponse.json(products);
  } catch (error) {
    console.warn("Failed to fetch products from Shopify, using mock products:", error);
    return NextResponse.json(MOCK_PRODUCTS);
  }
}

