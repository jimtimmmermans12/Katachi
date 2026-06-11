'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import CartDrawer from '@/components/CartDrawer';

// ── Types (shared with CartDrawer) ───────────────────────────────────────────

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

type CartContextType = {
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
};

// ── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

const CART_ID_KEY = 'katachi_cart_id';

// ── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CART_ID_KEY);
    if (!stored) return;
    fetch(`/api/cart?id=${encodeURIComponent(stored)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ShopifyCart | null) => {
        if (data) setCart(data);
        else localStorage.removeItem(CART_ID_KEY);
      })
      .catch(() => {});
  }, []);

  // Create a new cart if none exists, returning its id
  const ensureCart = useCallback(async (): Promise<string> => {
    const stored = localStorage.getItem(CART_ID_KEY);
    if (stored && cart) return cart.id;

    const res = await fetch('/api/cart', { method: 'POST' });
    if (!res.ok) throw new Error('Could not create cart');
    const newCart: ShopifyCart = await res.json();
    localStorage.setItem(CART_ID_KEY, newCart.id);
    setCart(newCart);
    return newCart.id;
  }, [cart]);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        const cartId = await ensureCart();
        const res = await fetch('/api/cart/lines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId, variantId, quantity }),
        });
        if (!res.ok) throw new Error('Failed to add item');
        const updated: ShopifyCart = await res.json();
        setCart(updated);
        setIsOpen(true);
      } catch (err) {
        console.error('[cart] addToCart:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [ensureCart],
  );

  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const res = await fetch('/api/cart/lines', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId: cart.id, lineId }),
        });
        if (!res.ok) throw new Error('Failed to remove item');
        const updated: ShopifyCart = await res.json();
        setCart(updated);
      } catch (err) {
        console.error('[cart] removeFromCart:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [cart],
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      if (quantity <= 0) { await removeFromCart(lineId); return; }
      setIsLoading(true);
      try {
        const res = await fetch('/api/cart/lines', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId: cart.id, lineId, quantity }),
        });
        if (!res.ok) throw new Error('Failed to update quantity');
        const updated: ShopifyCart = await res.json();
        setCart(updated);
      } catch (err) {
        console.error('[cart] updateQuantity:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [cart, removeFromCart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openDrawer: () => setIsOpen(true),
        closeDrawer: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}
