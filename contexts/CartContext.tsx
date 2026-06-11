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
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

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

  // Create a brand-new cart and persist its id
  const createFreshCart = useCallback(async (): Promise<ShopifyCart> => {
    const res = await fetch('/api/cart', { method: 'POST' });
    if (!res.ok) throw new Error('Could not create cart');
    const newCart: ShopifyCart = await res.json();
    localStorage.setItem(CART_ID_KEY, newCart.id);
    setCart(newCart);
    return newCart;
  }, []);

  // Create a new cart if none exists, returning its id
  const ensureCart = useCallback(async (): Promise<string> => {
    const stored = localStorage.getItem(CART_ID_KEY);
    if (stored && cart) return cart.id;
    const newCart = await createFreshCart();
    return newCart.id;
  }, [cart, createFreshCart]);

  const addToCart = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      setError(null);

      const addLines = async (cartId: string): Promise<ShopifyCart> => {
        const res = await fetch('/api/cart/lines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartId, variantId, quantity }),
        });
        if (!res.ok) throw new Error('Failed to add item');
        return res.json();
      };

      try {
        const cartId = await ensureCart();
        let updated: ShopifyCart;
        try {
          updated = await addLines(cartId);
        } catch {
          // Stored cart may be expired (e.g., after a completed checkout) —
          // discard it, create a fresh cart, and retry once.
          localStorage.removeItem(CART_ID_KEY);
          setCart(null);
          const fresh = await createFreshCart();
          updated = await addLines(fresh.id);
        }
        setCart(updated);
        setIsOpen(true);
      } catch (err) {
        console.error('[cart] addToCart:', err);
        setError('Something went wrong adding this item. Please try again.');
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [ensureCart, createFreshCart],
  );

  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (!cart) return;
      setIsLoading(true);
      setError(null);
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
      setError(null);
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
        error,
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
