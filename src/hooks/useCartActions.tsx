import { type Cart, type Product } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";

import { type CartItem } from "../types/cart";
import getStripe from "../utils/get-stripejs";
import { tranformCartItems } from "../utils/helpers";
import { toast } from "react-toastify";
import { trpc } from "../utils/trpc";
import { type CartItemGuest, useCart } from "../context/CartContext";

export const useCartActions = () => {
  const utils = trpc.useContext();
  const {
    increaseQuantity: addItemsGuest,
    decreaseQuantity,
    deleteGuestItem,
    clearCart: clearGuestCart,
  } = useCart();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user?.id;
  const cartUser = trpc.cart.getUserCart.useQuery(undefined, {
    enabled: false,
  });
  const increaseQuantity = trpc.cart.increaseQuantity.useMutation({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async onMutate(el: { item: CartItem; quantity: number }) {
      const newQuantity = el.item.quantity + el.quantity;
      await utils.cart.getCartItems.cancel();
      const prevData = utils.cart.getCartItems.getData();

      utils.cart.getCartItems.setData(undefined, (old) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        old!.map(
          (oldCart: {
            cart: Cart;
            product: Product;
            id: string;
            quantity: number;
            cartId: string;
          }) => {
            if (oldCart.id === el.item.id) {
              console.log("NEW ITEMS OLD CART");
              oldCart.quantity = newQuantity;
              console.log(oldCart);
              return oldCart;
            }
            return oldCart;
          }
        )
      );

      return { prevData };
    },
    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      utils.cart.getCartItems.setData(undefined, ctx.prevData);
    },
    onSettled() {
      utils.cart.getCartItems.invalidate();
    },
  });

  const addNewToCart = trpc.cart.addNewItem.useMutation({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async onMutate(el: { userId: string; item: Product; quantity: number }) {
      await utils.cart.getCartItems.cancel();
      const prevData = utils.cart.getCartItems.getData();

      const newItem = {
        id: (Math.random() + 1).toString(36).substring(7),
        product: el.item,
        productId: el.item.id,
        quantity: el.quantity,
        cart: cartUser.data,
        cartId: cartUser?.data?.id,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      utils.cart.getCartItems.setData(undefined, (old) => [...old, newItem]);
      return { prevData };
    },

    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      utils.cart.getCartItems.setData(undefined, ctx.prevData);
    },
    onSettled() {
      utils.cart.getCartItems.invalidate();
    },
  });

  const removeFromCart = trpc.cart.removeItem.useMutation({
    async onMutate(id: string) {
      await utils.cart.getCartItems.cancel();
      const prevData = utils.cart.getCartItems.getData();
      const newItems = prevData?.filter((item) => item.id !== id);
      utils.cart.getCartItems.setData(undefined, () => newItems);
      return { prevData };
    },
    onError(err, newPost, ctx) {
      utils.cart.getCartItems.setData(undefined, ctx?.prevData);
    },
    onSettled() {
      utils.cart.getCartItems.invalidate();
    },
  });
  const removeOne = trpc.cart.removeOne.useMutation({
    async onMutate(el: CartItem) {
      await utils.cart.getCartItems.cancel();
      const prevData = utils.cart.getCartItems.getData();
      prevData?.forEach((item) => {
        if (item.id === el.id) {
          item.quantity--;
        }
      });

      utils.cart.getCartItems.setData(undefined, () => prevData);
      return { prevData };
    },
    onError(err, newPost, ctx) {
      utils.cart.getCartItems.setData(undefined, ctx?.prevData);
    },
    onSettled() {
      utils.cart.getCartItems.invalidate();
    },
  });

  const removeCart = trpc.cart.removeCart.useMutation({
    async onMutate() {
      await utils.cart.getCartItems.cancel();
      const prevData = utils.cart.getCartItems.getData();
      utils.cart.getCartItems.setData(undefined, () => []);
      return { prevData };
    },
    onError(err, newPost, ctx) {
      utils.cart.getCartItems.setData(undefined, ctx?.prevData);
    },
    onSettled() {
      utils.cart.getCartItems.invalidate();
    },
    onSuccess() {
      utils.cart.getUserCart.refetch();
    },
  });

  const clearCart = () => {
    if (!userId) return clearGuestCart();
    return removeCart.mutate(userId);
  };

  const addToCartRegulator = ({
    item,
    quantity,
  }: {
    item: Product;
    quantity: number;
  }) => {
    const prevData = utils.cart.getCartItems.getData();
    console.log(prevData);
    if (!prevData) return;
    const existing = prevData?.find((data) => {
      return data.product.id === item.id;
    });
    if (existing) {
      return increaseQuantity.mutate({ item: existing, quantity });
    } else {
      return addNewToCart.mutate({ item, quantity });
    }
  };

  const addToCartHandler = (el: Product, quantity: number) => {
    if (!userId) return addItemsGuest(el);
    toast.success("Added to cart");
    addToCartRegulator({ item: el, quantity });
  };

  const removeItem = (id: string) => {
    if (!userId) {
      return deleteGuestItem(id);
    }
    return removeFromCart.mutate(id);
  };

  const deleteOne = (el: CartItem) => {
    if (!userId) {
      return decreaseQuantity(el.id);
    }
    if (el.quantity === 1) {
      return removeFromCart.mutate(el.id);
    }
    if (el.quantity > 1) {
      return removeOne.mutate(el);
    }
  };
  const createCheckOutSession = async (
    cartItems: CartItemGuest[] | CartItem[] | undefined
  ) => {
    const stripe = await getStripe();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const transformedItems = tranformCartItems(cartItems);

    const checkoutSession = await axios.post(
      "/api/checkout_sessions",
      transformedItems
    );

    const result = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result?.error) {
      alert(result?.error.message);
    }
  };

  return {
    addToCartHandler,
    removeItem,
    deleteOne,
    clearCart,
    createCheckOutSession,
  };
};
