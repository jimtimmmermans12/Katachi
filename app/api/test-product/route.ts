import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get('handle');
  if (!handle) {
    return NextResponse.json({ error: 'handle is required' }, { status: 400 });
  }

  const domain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ??
    process.env.SHOPIFY_STORE_DOMAIN;
  const token =
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ??
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return NextResponse.json({ error: 'Shopify credentials not configured' }, { status: 500 });
  }

  const query = `{
    product(handle: "${handle}") {
      id
      title
      handle
      descriptionHtml
      description
      productType
      vendor
      tags
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      images(first: 6) {
        edges { node { url altText } }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            image { url altText }
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
  }`;

  const res = await fetch(
    `https://${domain}/api/2024-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: `Shopify responded with ${res.status}` }, { status: 502 });
  }

  const data = await res.json();

  if (data.errors?.length) {
    return NextResponse.json({ error: data.errors[0].message }, { status: 502 });
  }

  const product = data.data?.product;
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
