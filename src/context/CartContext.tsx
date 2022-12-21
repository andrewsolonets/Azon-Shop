import { useState, createContext, type ReactNode, useContext } from "react";
import { CartMenu } from "../components/CartMenu";

import { randUuid } from "@ngneat/falso";
import { type Product } from "@prisma/client";

type CartProviderProps = {
  children: ReactNode;
};

export type CartItemGuest = {
  id: string;
  product: Product;
  cart: string;
  cartId: string;
  quantity: number;
};
type CartContext = {
  toggleCart: () => void;
  cartItems: CartItemGuest[];
  increaseQuantity: (item: Product) => void;
  getCartQuantity: () => number;
  decreaseQuantity: (id: string) => void;
  deleteGuestItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext({} as CartContext);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: CartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemGuest[]);

  const toggleCart = () => setIsOpen((prev) => !prev);
  console.log(cartItems);

  const getCartQuantity = () =>
    cartItems.reduce((acc, el) => el.quantity + acc, 0);

  const deleteGuestItem = (id: string) =>
    setCartItems((currItems) => currItems.filter((el) => el.id !== id));

  const decreaseQuantity = (id: string) => {
    return setCartItems((currItems) => {
      if (currItems.find((el) => el.id === id)?.quantity === 1) {
        return currItems.filter((el) => el.id !== id);
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const increaseQuantity = (item: Product) => {
    return setCartItems((currItems) => {
      if (currItems.find((el) => el.product.id === item.id) == null) {
        return [
          ...currItems,
          {
            id: randUuid(),
            product: item,
            cart: "guest",
            cartId: randUuid(),
            quantity: 1,
          },
        ];
      } else {
        return currItems.map((el) => {
          if (el.product.id === item.id) {
            return { ...el, quantity: el.quantity + 1 };
          } else {
            return el;
          }
        });
      }
    });
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        toggleCart,
        cartItems,
        increaseQuantity,
        getCartQuantity,
        decreaseQuantity,
        deleteGuestItem,
        clearCart,
      }}
    >
      {children}
      <CartMenu isOpen={isOpen} />
    </CartContext.Provider>
  );
}
