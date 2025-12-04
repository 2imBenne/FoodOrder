import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem, CartState, Dish, ShippingZone } from "../types";

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  note: string;
  shippingZone?: ShippingZone;
  voucherCode?: string;
  addItem: (dish: Dish, quantity?: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  removeItem: (dishId: number) => void;
  clear: () => void;
  setNote: (value: string) => void;
  setShippingZone: (zone?: ShippingZone) => void;
  applyVoucher: (payload?: { code: string; discount: number }) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = "foodorder.cart";

const initialState: CartState = {
  items: [],
  note: "",
  voucherDiscount: 0,
};

const loadCart = (): CartState => {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return initialState;
  try {
    return { ...initialState, ...JSON.parse(raw) } as CartState;
  } catch {
    return initialState;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>(() => loadCart());

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = useCallback((dish: Dish, quantity = 1) => {
    setState((prev) => {
      const exists = prev.items.find((item) => item.dish.id === dish.id);
      if (exists) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.dish.id === dish.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        ...prev,
        items: [...prev.items, { dish, quantity }],
      };
    });
  }, []);

  const updateQuantity = useCallback((dishId: number, quantity: number) => {
    setState((prev) => ({
      ...prev,
      items: prev.items
        .map((item) => (item.dish.id === dishId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    }));
  }, []);

  const removeItem = useCallback((dishId: number) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.dish.id !== dishId),
    }));
  }, []);

  const clear = useCallback(() => {
    setState(initialState);
  }, []);

  const setNote = useCallback((value: string) => {
    setState((prev) => ({ ...prev, note: value }));
  }, []);

  const setShippingZone = useCallback((zone?: ShippingZone) => {
    setState((prev) => ({ ...prev, shippingZone: zone }));
  }, []);

  const applyVoucher = useCallback(
    (payload?: { code: string; discount: number }) => {
      setState((prev) => ({
        ...prev,
        voucherCode: payload?.code,
        voucherDiscount: payload?.discount ?? 0,
      }));
    },
    []
  );

  const totals = useMemo(() => {
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.dish.price * item.quantity,
      0
    );
    const shippingFee = state.shippingZone?.fee ?? 0;
    const discount = state.voucherDiscount;
    const total = Math.max(0, subtotal + shippingFee - discount);
    return { subtotal, shippingFee, discount, total };
  }, [state.items, state.shippingZone?.fee, state.voucherDiscount]);

  const value: CartContextValue = {
    items: state.items,
    note: state.note,
    shippingZone: state.shippingZone,
    voucherCode: state.voucherCode,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    setNote,
    setShippingZone,
    applyVoucher,
    ...totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
