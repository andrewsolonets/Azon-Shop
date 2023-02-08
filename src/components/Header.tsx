import CartIcon from "../../public/static/img/CartIcon";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import Link from "next/link";
import ProfileIcon from "../../public/static/img/ProfileIcon";
import { NavMain } from "./NavMain";
import { useCart } from "../context/CartContext";
import Search from "./Search/Search";

export const Header = () => {
  const { data: sessionData } = useSession();
  const { toggleCart, getCartQuantity } = useCart();

  const userId = sessionData?.user?.id;
  const { data: cartItems } = api.cart.getCartItems.useQuery();
  let totalQuantity = 0;

  if (cartItems) {
    cartItems?.forEach((el) => {
      totalQuantity += el.quantity;
    });
  } else {
    totalQuantity = getCartQuantity();
  }

  return (
    <header className="drop-shadow-header fixed  top-0 left-0 right-0 z-20 flex items-center justify-between bg-violet-800 py-4 px-4 font-medium text-slate-50 backdrop-blur sm:gap-10  md:justify-start md:px-10">
      <Link href="/">
        <h3 className="text-2xl font-bold text-amber-400 transition-all duration-300 hover:text-violet-400">
          Azon
        </h3>
      </Link>

      <nav className="flex items-center justify-between gap-6 sm:w-full">
        <NavMain />
        <Search />
        <ul className="relative flex items-center gap-6 md:gap-8">
          <li className="relative ">
            <button
              onClick={toggleCart}
              className="group"
              aria-label="Open Cart"
            >
              <div className="h-7 w-7 ">
                <CartIcon className="fill-amber-400 transition-all duration-300 hover:fill-violet-400" />
              </div>
            </button>

            <span className="items absolute -bottom-2 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600">
              <span className="text-sm font-bold transition-all duration-300">
                {totalQuantity}
              </span>
            </span>
          </li>
          {userId && (
            <li>
              <Link
                href={`/profile/${userId ? userId : "#"}`}
                className="h-fit w-fit"
              >
                <div className="h-7 w-7">
                  <ProfileIcon className="fill-amber-400 hover:fill-violet-400 " />
                </div>
              </Link>
            </li>
          )}
          <li>
            <button
              className="outline-amber  w-max rounded-sm bg-transparent px-3 py-1 text-amber-400 outline outline-2 transition-all duration-300 hover:bg-amber-400/20 hover:bg-opacity-10 md:px-4"
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
