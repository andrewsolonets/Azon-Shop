import { useState, createContext, useContext, useEffect } from "react";
import { CartMenu } from "../components/CartMenu";

import { randUuid } from "@ngneat/falso";
import { type Product } from "@prisma/client";
import useLocalStorage from "../hooks/useLocalStorage";
import { api } from "../utils/api";
import { useSession } from "next-auth/react";
import {
  CartContext,
  type CartItemGuest,
  type CartProviderProps,
} from "../types/cart";
import { getTotalAmount } from "../utils/helpers";
import { useCartActions } from "../hooks/useCartActions";

const CartContext = createContext({} as CartContext);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: CartProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addItemsToUserCart } = useCartActions();
  const [cartItems, setCartItems] = useLocalStorage(
    "guestCart",
    [] as CartItemGuest[]
  );
  const { data: cartItemsServer } = api.cart.getCartItems.useQuery();
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    changeTotalAmount();
  }, [cartItems, cartItemsServer]);

  const changeTotalAmount = () => {
    if (cartItemsServer) {
      setTotalAmount(Math.round(getTotalAmount(cartItemsServer)));
    } else {
      setTotalAmount(Math.round(getTotalAmount(cartItems)));
    }
  };

  const { data: sessionData } = useSession();

  const userId = sessionData?.user?.id;

  useEffect(() => {
    if (userId && cartItems && cartItems.length !== 0) {
      addItemsToUserCart(cartItems);
      setCartItems([]);
    }
  }, [userId]);

  const toggleCart = () => setIsOpen((prev) => !prev);

  const getCartQuantity = () =>
    cartItems?.reduce((acc, el) => el.quantity + acc, 0);

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

  const increaseQuantity = (item: Product, quantity: number) => {
    return setCartItems((currItems) => {
      if (currItems.find((el) => el.product.id === item.id) == null) {
        return [
          ...currItems,
          {
            id: randUuid(),
            product: item,
            cart: "guest",
            cartId: randUuid(),
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
