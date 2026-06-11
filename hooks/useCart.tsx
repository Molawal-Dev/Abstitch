"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Cart, CartItem } from "@/types";

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { product_id: string; variant_id: string | null } }
  | { type: "UPDATE_QTY"; payload: { product_id: string; variant_id: string | null; quantity: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartItem[] };

function calcCart(items: CartItem[]): Cart {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const item_count = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items, total, item_count };
}

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "HYDRATE":
      return calcCart(action.payload);

    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) =>
          i.product_id === action.payload.product_id &&
          i.variant_id === action.payload.variant_id
      );
      if (existing) {
        const items = state.items.map((i) =>
          i.product_id === action.payload.product_id &&
          i.variant_id === action.payload.variant_id
            ? { ...i, quantity: i.quantity + action.payload.quantity }
            : i
        );
        return calcCart(items);
      }
      return calcCart([...state.items, action.payload]);
    }

    case "REMOVE_ITEM": {
      const items = state.items.filter(
        (i) =>
          !(
            i.product_id === action.payload.product_id &&
            i.variant_id === action.payload.variant_id
          )
      );
      return calcCart(items);
    }

    case "UPDATE_QTY": {
      if (action.payload.quantity <= 0) {
        const items = state.items.filter(
          (i) =>
            !(
              i.product_id === action.payload.product_id &&
              i.variant_id === action.payload.variant_id
            )
        );
        return calcCart(items);
      }
      const items = state.items.map((i) =>
        i.product_id === action.payload.product_id &&
        i.variant_id === action.payload.variant_id
          ? { ...i, quantity: action.payload.quantity }
          : i
      );
      return calcCart(items);
    }

    case "CLEAR":
      return calcCart([]);

    default:
      return state;
  }
}

const CART_KEY = "abstitch_cart";

interface CartContextValue {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, variant_id: string | null) => void;
  updateQty: (product_id: string, variant_id: string | null, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, calcCart([]));

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        dispatch({ type: "HYDRATE", payload: items });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart.items));
    } catch {
      // ignore
    }
  }, [cart.items]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback(
    (product_id: string, variant_id: string | null) => {
      dispatch({ type: "REMOVE_ITEM", payload: { product_id, variant_id } });
    },
    []
  );

  const updateQty = useCallback(
    (product_id: string, variant_id: string | null, quantity: number) => {
      dispatch({ type: "UPDATE_QTY", payload: { product_id, variant_id, quantity } });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
