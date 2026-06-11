"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface WishlistItem {
  product_id: string;
  name: string;
  slug: string;
  image: string;
  price: number | null;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: "ADD"; payload: WishlistItem }
  | { type: "REMOVE"; payload: string }
  | { type: "HYDRATE"; payload: WishlistItem[] };

function wishlistReducer(
  state: WishlistState,
  action: WishlistAction
): WishlistState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload };
    case "ADD":
      if (state.items.find((i) => i.product_id === action.payload.product_id)) {
        return state;
      }
      return { items: [...state.items, action.payload] };
    case "REMOVE":
      return {
        items: state.items.filter((i) => i.product_id !== action.payload),
      };
    default:
      return state;
  }
}

const WISHLIST_KEY = "abstitch_wishlist";

interface WishlistContextValue {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (product_id: string) => void;
  isWishlisted: (product_id: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_KEY);
      if (stored) {
        dispatch({ type: "HYDRATE", payload: JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.items));
    } catch {
      // ignore
    }
  }, [state.items]);

  const addItem = useCallback((item: WishlistItem) => {
    dispatch({ type: "ADD", payload: item });
  }, []);

  const removeItem = useCallback((product_id: string) => {
    dispatch({ type: "REMOVE", payload: product_id });
  }, []);

  const isWishlisted = useCallback(
    (product_id: string) => state.items.some((i) => i.product_id === product_id),
    [state.items]
  );

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        isWishlisted,
        count: state.items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}