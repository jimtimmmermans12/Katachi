import { NextRequest, NextResponse } from 'next/server';
import { cartLinesAdd, cartLinesUpdate, cartLinesRemove } from '@/lib/shopify-cart';

// POST /api/cart/lines  { cartId, variantId, quantity }  → add line
export async function POST(req: NextRequest) {
  try {
    const { cartId, variantId, quantity = 1 } = await req.json();
    if (!cartId || !variantId) return NextResponse.json({ error: 'cartId and variantId required' }, { status: 400 });
    const cart = await cartLinesAdd(cartId, variantId, quantity);
    return NextResponse.json(cart);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

// PATCH /api/cart/lines  { cartId, lineId, quantity }  → update quantity
export async function PATCH(req: NextRequest) {
  try {
    const { cartId, lineId, quantity } = await req.json();
    if (!cartId || !lineId || quantity == null) return NextResponse.json({ error: 'cartId, lineId, quantity required' }, { status: 400 });
    const cart = await cartLinesUpdate(cartId, lineId, quantity);
    return NextResponse.json(cart);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

// DELETE /api/cart/lines  { cartId, lineId }  → remove line
export async function DELETE(req: NextRequest) {
  try {
    const { cartId, lineId } = await req.json();
    if (!cartId || !lineId) return NextResponse.json({ error: 'cartId and lineId required' }, { status: 400 });
    const cart = await cartLinesRemove(cartId, lineId);
    return NextResponse.json(cart);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
