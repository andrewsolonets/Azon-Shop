import { type ReactNode } from "react";
import { ProductWithRelations } from "~/server/db/schema";

export interface CartItem {
  id: number;
  quantity: number;
}

export type CartProviderProps = {
  children: ReactNode;
};

export type CartItemGuest = {
  id: number;
  product: ProductWithRelations;
  cart?: string;
  cartId: number;
  quantity: number;
};
export type CartContext = {
  toggleCart: () => void;
  cartItems: CartItemGuest[];
  increaseQuantity: (item: ProductWithRelations, quantity: number) => void;
  getCartQuantity: () => number;
  decreaseQuantity: (id: number) => void;
  deleteGuestItem: (id: number) => void;
  clearCart: () => void;
  totalAmount: number;
};
