import { NextRequest, NextResponse } from "next/server";

// Back-in-stock requests are stored as Shopify customers tagged
// `notify-me` + `notify:{productHandle}:{variantTitle}`, so the merchant can
// filter them in Shopify admin → Customers and email them when stock returns.
// Without a valid admin token this degrades to logging (same as /api/newsletter)
// so the UI keeps working either way.

const TAG_PREFIX = "notify";

async function adminFetch<T>(
  domain: string,
  token: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`https://${domain}/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`Admin API responded with ${res.status}`);
  }
  const json: { data?: T; errors?: unknown } = await res.json();
  if (!json.data || json.errors) {
    throw new Error(`Admin API error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function storeInShopify(
  domain: string,
  token: string,
  email: string,
  tag: string,
): Promise<void> {
  // Look up the customer by email; add the tag if they exist, create otherwise.
  const found = await adminFetch<{
    customers: { edges: { node: { id: string; tags: string[] } }[] };
  }>(
    domain,
    token,
    `query FindCustomer($query: String!) {
      customers(first: 1, query: $query) { edges { node { id tags } } }
    }`,
    { query: `email:${email}` },
  );

  const existing = found.customers.edges[0]?.node;

  if (existing) {
    const tags = Array.from(new Set([...existing.tags, "notify-me", tag]));
    const result = await adminFetch<{
      customerUpdate: { userErrors: { message: string }[] };
    }>(
      domain,
      token,
      `mutation UpdateCustomer($input: CustomerInput!) {
        customerUpdate(input: $input) { userErrors { message } }
      }`,
      { input: { id: existing.id, tags } },
    );
    const errs = result.customerUpdate.userErrors;
    if (errs.length) throw new Error(errs.map((e) => e.message).join(", "));
  } else {
    const result = await adminFetch<{
      customerCreate: { userErrors: { message: string }[] };
    }>(
      domain,
      token,
      `mutation CreateCustomer($input: CustomerInput!) {
        customerCreate(input: $input) { userErrors { message } }
      }`,
      {
        input: {
          email,
          tags: ["notify-me", tag],
          note: `Back-in-stock request: ${tag}`,
        },
      },
    );
    const errs = result.customerCreate.userErrors;
    if (errs.length) throw new Error(errs.map((e) => e.message).join(", "));
  }
}

export async function POST(request: NextRequest) {
  let body: {
    email?: string;
    productHandle?: string;
    productTitle?: string;
    variantTitle?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const handle = (body.productHandle ?? "unknown").slice(0, 100);
  const variant = (body.variantTitle ?? "").slice(0, 100);
  const tag = variant ? `${TAG_PREFIX}:${handle}:${variant}` : `${TAG_PREFIX}:${handle}`;

  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ?? process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (domain && token) {
    try {
      await storeInShopify(domain, token, email, tag);
      return NextResponse.json({ success: true });
    } catch (err) {
      // Fall through to the log-only path — the visitor still gets a calm
      // confirmation; the failure is ours to fix, not theirs to see.
      console.error("[notify] Shopify storage failed:", err);
    }
  }

  console.log("[notify] back-in-stock request:", { email, tag, product: body.productTitle });
  return NextResponse.json({ success: true });
}
