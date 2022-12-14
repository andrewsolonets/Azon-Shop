import { useQuery } from "@tanstack/react-query";
import { useCartActions } from "../hooks/useCartActions";
import { getTotalAmount } from "../utils/helpers";
import { trpc } from "../utils/trpc";
import { ArrowBtn, OutlineBtn } from "./Buttons";
import { CartItemCard } from "./CartItem";
import { useEffect, useState } from "react";

export const Cart = ({}) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const { isOpen, clearCart, createCheckOutSession } = useCartActions();
  // const { totalAmount } = useQuery(["totalAmount"]);
  const cartItems = trpc.cart.getCartItems.useQuery();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setTotalAmount(getTotalAmount(cartItems.data));
  }, [cartItems]);

  return (
    <div className="fixed right-0 top-0 bottom-0 z-50 flex h-full flex-col justify-between bg-violet-800  pt-6">
      <div className="flex flex-col gap-6 px-8">
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <h4 className="text-2xl font-medium">My Basket</h4>
            <p className="">(items)</p>
          </div>
          <div className="flex items-center gap-4">
            <OutlineBtn onClick={() => clearCart()}>Clear</OutlineBtn>
            <OutlineBtn>Close</OutlineBtn>
          </div>
        </div>
        <div className="flex w-[600px] flex-col gap-4">
          {cartItems.data?.map((el) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return <CartItemCard key={el.id} item={el} />;
          })}
        </div>
      </div>
      <div className="flex w-full justify-between justify-self-end bg-violet-900 px-8 py-6">
        <div className="flex flex-col gap-2">
          <h6 className=" font-medium">Subtotal Amount:</h6>
          <h6 className="text-2xl font-semibold">${totalAmount}</h6>
        </div>
        <ArrowBtn onClick={() => createCheckOutSession(cartItems.data)}>
          Checkout
        </ArrowBtn>
      </div>
    </div>
  );
};
