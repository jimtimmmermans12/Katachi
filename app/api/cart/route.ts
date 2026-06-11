import { NextRequest, NextResponse } from 'next/server';
import { cartCreate, cartFetch } from '@/lib/shopify-cart';

// GET /api/cart?id=gid://...  → fetch existing cart
export async function GET(req: NextRequest) {
  const cartId = req.nextUrl.searchParams.get('id');
  if (!cartId) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    const cart = await cartFetch(cartId);
    if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    return NextResponse.json(cart);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

// POST /api/cart  → create new cart
export async function POST() {
  try {
    const cart = await cartCreate();
    return NextResponse.json(cart);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
