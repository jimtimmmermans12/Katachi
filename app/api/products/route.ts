import { NextResponse } from "next/server";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

export async function GET() {
  if (!domain || !token) {
    return NextResponse.json(
      { error: "Shopify credentials not configured" },
      { status: 500 }
    );
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
      throw new Error(
        `Shopify API responded with ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.errors?.length) {
      throw new Error(data.errors.map((e: any) => e.message).join(", "));
    }

    const products = data.data.products.edges.map((edge: any) => edge.node);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products from Shopify:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
