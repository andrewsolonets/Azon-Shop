import CartIcon from "../assets/cart.svg";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import ProfileIcon from "../assets/profile.svg";
import { useCart } from "../hooks/useCartActions";

export const Header = () => {
  const { data: sessionData } = useSession();
  const { toggleCart } = useCart();
  const userId = sessionData?.user?.id;

  const cartItems = trpc.cart.getCartItems.useQuery();
  let totalQuantity = 0;
  cartItems?.data?.forEach((el) => {
    totalQuantity += el.quantity;
  });
  return (
    <header className="drop-shadow-header fixed top-0 left-0 right-0 z-20 flex items-center gap-10 bg-violet-800 py-4 px-10 font-medium text-white  backdrop-blur">
      <Link href="/">
        <h3 className="text-2xl font-bold text-amber-400">Azon</h3>
      </Link>
      <nav className="flex w-full items-center justify-between">
        <ul className="flex items-center gap-10">
          <li>Home</li>
          <li>Shop</li>
        </ul>
        <ul className="flex items-center gap-8">
          <li className="relative ">
            <button onClick={toggleCart}>
              <div className="h-7 w-7">
                <CartIcon />
              </div>
            </button>

            <span className="items absolute -bottom-2 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600">
              <span className="text-sm font-bold">{totalQuantity}</span>
            </span>
          </li>
          <li>
            <Link
              href={`/profile/${userId ? userId : "#"}`}
              className="h-fit w-fit"
            >
              <div className="h-7 w-7">
                <ProfileIcon />
              </div>
            </Link>
          </li>
          <li>
            <button
              className="outline-ambtext-amber-400 hover:bg-ambtext-amber-400 rounded-sm bg-transparent px-4 py-1 text-amber-400 outline outline-2 transition-all duration-300 hover:bg-opacity-10"
              onClick={sessionData ? () => signOut() : () => signIn()}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};
