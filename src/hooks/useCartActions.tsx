import { type Product } from "@prisma/client";
import { useSession } from "next-auth/react";
import { type CartItem } from "../types/cart";
import { trpc } from "../utils/trpc";

export const useCartActions = () => {
  const utils = trpc.useContext();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user?.id || "hi";
  const cartUser = trpc.cart.getUserCart.useQuery(undefined, {
    enabled: false,
  });
  const addToCart = trpc.cart.addItem.useMutation({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async onMutate(el: { userId: string; item: Product; quantity: number }) {
      await utils.cart.getCartItems.cancel();
      console.log(el);
      const prevData = utils.cart.getCartItems.getData();
      if (!prevData) return;
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

  const deleteCart = () => {
    return removeCart.mutate(userId);
  };

  const addToCartHandler = (el: Product) => {
    console.log(el);
    return addToCart.mutate({ userId, item: el, quantity: 5 });
  };

  const deleteOne = (el: CartItem) => {
    if (el.quantity === 1) {
      return removeFromCart.mutate(el.id);
    }
    if (el.quantity > 1) {
      return removeOne.mutate(el);
    }
  };

  return {
    addToCartHandler,
    deleteOne,
    deleteCart,
  };
};
