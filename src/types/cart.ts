import { type Product } from "@prisma/client";
import { type ReactNode } from "react";

export interface CartItem {
  id: string;
  quantity: number;
}

export type CartProviderProps = {
  children: ReactNode;
};

export type CartItemGuest = {
  id: string;
  product: Product;
  cart: string;
  cartId: string;
  quantity: number;
};
export type CartContext = {
  toggleCart: () => void;
  cartItems: CartItemGuest[];
  increaseQuantity: (item: Product, quantity: number) => void;
  getCartQuantity: () => number;
  decreaseQuantity: (id: string) => void;
  deleteGuestItem: (id: string) => void;
  clearCart: () => void;
  totalAmount: number;
};
