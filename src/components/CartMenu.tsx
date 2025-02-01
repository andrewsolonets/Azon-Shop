"use client";

import { useCartActions } from "../hooks/useCartActions";

import { CartItemCard } from "./CartItem";
import { useCart } from "../context/CartContext";
import { api } from "~/trpc/react";
import { ArrowButton, OutlineBtn } from "./ui/Buttons";
import { CartItemGuest } from "~/types/cart";
import { CartItemPlus } from "~/utils/helpers";

// TODO: fix checkout btn styling (takes too much height)
export const CartMenu = ({ isOpen }: { isOpen: boolean }) => {
  const { clearCart, createCheckOutSession } = useCartActions();
  const { toggleCart, cartItems: guestItems, totalAmount } = useCart();
  const { data: dbCartItems } = api.cart.getCartItems.useQuery();

  const cartItems = dbCartItems?.length ? dbCartItems : guestItems;

  return (
    <div
      data-cy="cart-menu"
      className={`${
        isOpen ? "" : "translate-x-full"
      } animate fixed bottom-0 top-0 z-50 flex h-screen w-screen justify-end duration-500 ease-out`}
    >
      <div
        data-cy="close-cart-button"
        className="md:h-full md:w-2/3"
        onClick={() => toggleCart()}
      ></div>
      <div
        className={`flex h-full w-screen transform flex-col justify-between bg-violet-800 pt-6 text-white md:w-fit`}
      >
        <div className="flex h-5/6 flex-col gap-6 px-4 md:px-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <h4 className="text-2xl font-medium">My Basket</h4>
              <p className="">({cartItems?.length ?? 0} items)</p>
            </div>
            <div className="flex items-center gap-4">
              {cartItems?.length ? (
                <OutlineBtn data-cy="clear-cart" onClick={() => clearCart()}>
                  Clear
                </OutlineBtn>
              ) : null}
              <OutlineBtn onClick={toggleCart}>Close</OutlineBtn>
            </div>
          </div>
          <div className="flex h-fit w-full flex-col gap-4 overflow-y-auto md:w-[600px]">
            {cartItems?.map((el) => {
              return (
                <CartItemCard
                  key={el.id}
                  item={el as unknown as CartItemGuest}
                />
              );
            })}
          </div>
        </div>
        <div className="flex w-full items-center justify-between justify-self-end bg-violet-900 px-4 py-4 md:px-8 md:py-6">
          <div className="flex flex-col gap-2">
            <h6 className="font-medium">Subtotal Amount:</h6>
            <h6 className="text-2xl font-semibold">${totalAmount}</h6>
          </div>

          <ArrowButton
            onClick={() =>
              createCheckOutSession(
                //@ts-expect-error cart items type error
                cartItems,
              )
            }
          >
            Checkout
          </ArrowButton>
        </div>
      </div>
    </div>
  );
};
