"use client";

import { useAuth } from "@clerk/nextjs";
import { randomUUID } from "crypto";
import { createContext, useContext, useEffect, useState } from "react";
import { CartMenu } from "~/components/CartMenu";
import { useCartActions } from "~/hooks/useCartActions";
import useLocalStorage from "~/hooks/useLocalStorage";
import { ProductWithRelations } from "~/server/db/schema";
import { api } from "~/trpc/react";
import {
  CartContext as CartContextType,
  CartItemGuest,
  CartProviderProps,
} from "~/types/cart";
import { getTotalAmount } from "~/utils/helpers";

const CartContext = createContext({} as CartContextType);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: CartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addItemsToUserCart } = useCartActions();
  const [cartItems, setCartItems] = useLocalStorage(
    "guestCart",
    [] as CartItemGuest[],
  );

  const { data: cartItemsServer } = api.cart.getCartItems.useQuery();
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    changeTotalAmount();
  }, [cartItems, cartItemsServer]);

  const changeTotalAmount = () => {
    if (cartItemsServer) {
      setTotalAmount(
        Math.round(getTotalAmount(cartItemsServer as CartItemGuest[])),
      );
    } else {
      setTotalAmount(Math.round(getTotalAmount(cartItems)));
    }
  };

  const { userId } = useAuth();

  useEffect(() => {
    if (userId && cartItems && cartItems.length !== 0) {
      addItemsToUserCart(cartItems);
      setCartItems([]);
    }
  }, [userId]);

  const toggleCart = () => setIsOpen((prev) => !prev);

  const getCartQuantity = () =>
    cartItems?.reduce((acc, el) => el.quantity + acc, 0);

  const deleteGuestItem = (id: number) =>
    setCartItems((currItems) => currItems.filter((el) => el.id !== id));

  const decreaseQuantity = (id: number) => {
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

  const increaseQuantity = (item: ProductWithRelations, quantity: number) => {
    return setCartItems((currItems) => {
      if (currItems.find((el) => el.product.id === item.id) == null) {
        return [
          ...currItems,
          {
            id: Math.random() * 1000,
            product: item,
            cart: "guest",
            cartId: Math.random() * 1000,
            quantity: quantity,
          },
        ];
      } else {
        return currItems.map((el) => {
          if (el.product.id === item.id) {
            return { ...el, quantity: el.quantity + quantity };
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
        totalAmount,
      }}
    >
      {children}
      <CartMenu isOpen={isOpen} />
    </CartContext.Provider>
  );
}
