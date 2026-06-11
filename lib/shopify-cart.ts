// Shopify Storefront cart API — server-only (used by /api/cart/* route handlers)

export type CartLineItem = {
  id: string;
  quantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  merchandise: {
    id: string;
    title: string;
    image: { url: string; altText: string | null } | null;
    product: {
      title: string;
      handle: string;
      featuredImage: { url: string; altText: string | null } | null;
    };
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: { amount: string; currencyCode: string };
    subtotalAmount: { amount: string; currencyCode: string };
  };
  lines: CartLineItem[];
};

// ── Internals ────────────────────────────────────────────────────────────────

function credentials() {
  const domain =
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ??
    process.env.SHOPIFY_STORE_DOMAIN;
  const token =
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ??
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  return { domain, token };
}

async function sf(query: string, variables: Record<string, unknown> = {}): Promise<unknown> {
  const { domain, token } = credentials();
  if (!domain || !token) throw new Error('Shopify Storefront credentials not configured');

  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`Shopify responded with ${res.status}`);
  const json = await res.json() as { data: unknown; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

function normalizeCart(raw: Record<string, unknown>): ShopifyCart {
  const lines = raw.lines as { edges: { node: CartLineItem }[] };
  return {
    id: raw.id as string,
    checkoutUrl: raw.checkoutUrl as string,
    totalQuantity: raw.totalQuantity as number,
    cost: raw.cost as ShopifyCart['cost'],
    lines: lines.edges.map((e) => e.node),
  };
}

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    totalAmount { amount currencyCode }
    subtotalAmount { amount currencyCode }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            image { url altText }
            product {
              title
              handle
              featuredImage { url altText }
            }
          }
        }
      }
    }
  }
`;

// ── Public API ───────────────────────────────────────────────────────────────

export async function cartCreate(): Promise<ShopifyCart> {
  const data = await sf(`
    mutation cartCreate {
      cartCreate(input: {}) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `) as { cartCreate: { cart: Record<string, unknown>; userErrors: { message: string }[] } };
  if (data.cartCreate.userErrors.length) throw new Error(data.cartCreate.userErrors[0].message);
  return normalizeCart(data.cartCreate.cart);
}

export async function cartFetch(cartId: string): Promise<ShopifyCart | null> {
  const data = await sf(`
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ${CART_FIELDS} }
    }
  `, { cartId }) as { cart: Record<string, unknown> | null };
  if (!data.cart) return null;
  return normalizeCart(data.cart);
}

export async function cartLinesAdd(
  cartId: string,
  variantId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const data = await sf(`
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `, { cartId, lines: [{ merchandiseId: variantId, quantity }] }) as {
    cartLinesAdd: { cart: Record<string, unknown>; userErrors: { message: string }[] };
  };
  if (data.cartLinesAdd.userErrors.length) throw new Error(data.cartLinesAdd.userErrors[0].message);
  return normalizeCart(data.cartLinesAdd.cart);
}

export async function cartLinesUpdate(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ShopifyCart> {
  const data = await sf(`
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `, { cartId, lines: [{ id: lineId, quantity }] }) as {
    cartLinesUpdate: { cart: Record<string, unknown>; userErrors: { message: string }[] };
  };
  if (data.cartLinesUpdate.userErrors.length) throw new Error(data.cartLinesUpdate.userErrors[0].message);
  return normalizeCart(data.cartLinesUpdate.cart);
}

export async function cartLinesRemove(
  cartId: string,
  lineId: string,
): Promise<ShopifyCart> {
  const data = await sf(`
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }
  `, { cartId, lineIds: [lineId] }) as {
    cartLinesRemove: { cart: Record<string, unknown>; userErrors: { message: string }[] };
  };
  if (data.cartLinesRemove.userErrors.length) throw new Error(data.cartLinesRemove.userErrors[0].message);
  return normalizeCart(data.cartLinesRemove.cart);
}
