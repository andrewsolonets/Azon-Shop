/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

//@ts-nocheck
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { useCart } from "~/context/CartContext";
import { CartModel, ProductWithRelations } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { CartItem, CartItemGuest } from "~/types/cart";
import getStripe from "~/utils/get-stripejs";
import { CartItemPlus, tranformCartItems } from "~/utils/helpers";

export const useCartActions = () => {
  const utils = api.useContext();
  const {
    increaseQuantity: addItemsGuest,
    decreaseQuantity,
    deleteGuestItem,
    clearCart: clearGuestCart,
  } = useCart();
  const { userId } = useAuth();

  const cartUser = api.cart.getUserCart.useQuery(undefined, {
    enabled: false,
  });
  const increaseQuantity = api.cart.increaseQuantity.useMutation({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async onMutate(el: { itemId: number; quantity: number }) {
      await utils.cart.getCartItems.cancel();
      const prevData = utils.cart.getCartItems.getData();
      console.log(prevData);
      //@ts-ignore
      utils.cart.getCartItems.setData(undefined, (old) => {
        if (!old) return;
        console.log(old, el);
        return old.map(
          //@ts-ignore
          (oldCartItem: {
            cart: CartModel;
            product: ProductWithRelations;
            id: number;
            quantity: number;
            cartId: number;
          }) => {
            if (oldCartItem.id === el.itemId) {
              return {
                ...oldCartItem,
                quantity: oldCartItem.quantity + el.quantity,
              };
            } else {
              return oldCartItem;
            }
          },
        );
      });

      return { prevData };
    },
    onError(err, newPost, ctx) {
      console.log(err);
      // If the mutation fails, use the context-value from onMutate
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      utils.cart.getCartItems.setData(undefined, ctx.prevData);
    },
    async onSettled() {
      await utils.cart.getCartItems.invalidate();
    },
  });

  const addNewToCart = api.cart.addNewItem.useMutation({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async onMutate(el: {
      userId: string;
      item: ProductWithRelations;
      quantity: number;
    }) {
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
      void utils.cart.getCartItems.invalidate();
    },
  });

  const removeFromCart = api.cart.removeItem.useMutation({
    async onMutate(id: number) {
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
      void utils.cart.getCartItems.invalidate();
    },
  });
  const removeOne = api.cart.removeOne.useMutation({
    async onMutate(el: CartItem) {
      await utils.cart.getCartItems.cancel();
      const prevData = utils.cart.getCartItems.getData();

      utils.cart.getCartItems.setData(undefined, (old) => {
        if (!old) return;
        return old.map((item) => {
          if (item.id === el.id) {
            return { ...item, quantity: (item?.quantity ?? 0) - 1 };
          } else {
            return item;
          }
        });
      });
      return { prevData };
    },
    onError(err, newPost, ctx) {
      utils.cart.getCartItems.setData(undefined, ctx?.prevData);
    },
    onSettled() {
      void utils.cart.getCartItems.invalidate();
    },
  });

  const removeCart = api.cart.removeCart.useMutation({
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
      void utils.cart.getCartItems.invalidate();
    },
    onSuccess() {
      void utils.cart.getUserCart.refetch();
    },
  });

  const clearCart = () => {
    if (!userId) return clearGuestCart();
    return removeCart.mutate();
  };

  const transferItems = api.cart.addCartItems.useMutation({
    async onMutate(
      items: {
        product: {
          id: number;
        };
        quantity: number;
      }[],
    ) {
      await utils.cart.getCartItems.cancel();
      const prevData = utils.cart.getCartItems.getData();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      utils.cart.getCartItems.setData(undefined, (old) => {
        if (!old) return items;
        return [...old, items];
      });
      return { prevData };
    },
    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      utils.cart.getCartItems.setData(undefined, ctx.prevData);
    },
    onSettled() {
      void utils.cart.getCartItems.invalidate();
    },
  });

  const addItemsToUserCart = (cartItems: CartItemGuest[]) => {
    transferItems.mutate(cartItems);
  };

  const addToCartRegulator = ({
    item,
    quantity,
  }: {
    item: ProductWithRelations;
    quantity: number;
  }) => {
    const prevData = utils.cart.getCartItems.getData();
    const existing = prevData?.find((data) => {
      return data.product.id === item.id;
    });
    if (existing) {
      console.log(existing, "EXISTING", { itemId: existing.id, quantity });
      increaseQuantity.mutate({ itemId: existing.id, quantity });
    } else {
      toast.success("Added to cart");
      return addNewToCart.mutate({ item, quantity });
    }
  };

  const addToCartHandler = (el: ProductWithRelations, quantity: number) => {
    if (!userId) return addItemsGuest(el, quantity);
    addToCartRegulator({ item: el, quantity });
  };

  const removeItem = (id: number) => {
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
    cartItems: CartItemGuest[] | CartItemPlus | undefined,
  ) => {
    const stripe = await getStripe();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const transformedItems = tranformCartItems(cartItems);

    const checkoutSession = await axios.post(
      "/api/checkout_sessions",
      transformedItems,
    );

    const result = await stripe?.redirectToCheckout({
      //@ts-ignore
      sessionId: (checkoutSession as { data: { id: string } }).data.id,
    });

    if (result?.error) {
      alert(result?.error.message);
    }
  };

  return {
    addToCartHandler,
    removeItem,
    addItemsToUserCart,
    deleteOne,
    clearCart,
    createCheckOutSession,
  };
};
