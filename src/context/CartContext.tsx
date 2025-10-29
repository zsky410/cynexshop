import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { CartItem } from "../types";

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, optionId?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    optionId?: string
  ) => void;
  getTotal: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.productId === item.productId && i.optionId === item.optionId
      );

      if (existingItem) {
        return prevItems.map((i) =>
          i.productId === item.productId && i.optionId === item.optionId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prevItems, item];
    });
  };

  const removeFromCart = (productId: string, optionId?: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (i) => !(i.productId === productId && i.optionId === optionId)
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    optionId?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, optionId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((i) =>
        i.productId === productId && i.optionId === optionId
          ? { ...i, quantity }
          : i
      )
    );
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
