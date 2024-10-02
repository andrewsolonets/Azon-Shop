import { useCartActions } from "../hooks/useCartActions";
import { api } from "../utils/api";
import { ArrowBtn, OutlineBtn } from "./Buttons";
import { CartItemCard } from "./CartItem";
import { useCart } from "../context/CartContext";

export const CartMenu = ({ isOpen }: { isOpen: boolean }) => {
  const { clearCart, createCheckOutSession } = useCartActions();
  const { toggleCart, cartItems: guestItems, totalAmount } = useCart();
  const { data: cartItems } = api.cart.getCartItems.useQuery();

  return (
    <div
      className={`${
        isOpen ? "" : "translate-x-full"
      } animate fixed top-0 bottom-0 z-50 flex h-screen w-screen justify-end duration-500 ease-out`}
    >
      <div className="md:h-full md:w-2/3  " onClick={() => toggleCart()}></div>
      <div
        className={`flex h-full w-screen transform flex-col justify-between bg-violet-800 pt-6 text-white  md:w-fit `}
      >
        <div className="flex h-5/6 flex-col gap-6 px-4 md:px-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <h4 className="text-2xl font-medium">My Basket</h4>
              <p className="">(items)</p>
            </div>
            <div className="flex items-center gap-4">
              <OutlineBtn onClick={() => clearCart()}>Clear</OutlineBtn>
              <OutlineBtn onClick={toggleCart}>Close</OutlineBtn>
            </div>
          </div>
          <div className="flex  h-fit w-full flex-col gap-4 overflow-y-auto md:w-[600px]">
            {cartItems
              ? cartItems?.map((el) => {
                  return <CartItemCard key={el.id} item={el} />;
                })
              : guestItems
              ? guestItems?.map((el) => {
                  return <CartItemCard key={el.id} item={el} />;
                })
              : ""}
          </div>
        </div>
        <div className="flex h-1/6 w-full justify-between justify-self-end bg-violet-900 py-4 px-4 md:px-8 md:py-6">
          <div className="flex flex-col gap-2">
            <h6 className=" font-medium">Subtotal Amount:</h6>
            <h6 className="text-2xl font-semibold">${totalAmount}</h6>
          </div>
          <ArrowBtn
            onClick={() =>
              createCheckOutSession(cartItems ? cartItems : guestItems)
            }
          >
            Checkout
          </ArrowBtn>
        </div>
      </div>
    </div>
  );
};
