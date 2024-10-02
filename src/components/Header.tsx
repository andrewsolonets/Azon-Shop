"use client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartIcon from "public/img/CartIcon";
import ProfileIcon from "public/img/ProfileIcon";

// TODO: refactor navigation - use client component only when needed, disable links when on that page, use shadcn
// TODO: Make breadcrumb links
const NavMain = () => {
  const pathname = usePathname();
  return (
    <ul className="hidden items-center gap-10 sm:flex">
      <li>
        <Link
          href="/"
          className={`transition-all duration-300 hover:text-violet-300 active:text-amber-300 ${
            pathname == "/" ? "font-semibold text-amber-400" : "text-slate-50"
          }`}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/categories"
          className={`transition-all duration-300 hover:text-violet-300 active:text-amber-300 ${
            pathname == "/categories"
              ? "font-semibold text-amber-400"
              : "text-slate-50"
          }`}
        >
          Categories
        </Link>
      </li>
      {/* <li className="w-max">
        <Link
          href="/products"
          className={`transition-all duration-300 hover:text-violet-300 active:text-amber-300 ${
            pathname == "/products"
              ? "font-semibold text-amber-400"
              : "text-white"
          }`}
        >
          All Products
        </Link>
      </li> */}
    </ul>
  );
};

export const Header = () => {
  // const { data: sessionData } = useSession();
  // const { toggleCart, getCartQuantity } = useCart();

  // const userId = sessionData?.user?.id;
  // const { data: cartItems } = api.cart.getCartItems.useQuery();
  // let totalQuantity = 0;

  // if (cartItems) {
  //   cartItems?.forEach((el) => {
  //     totalQuantity += el.quantity;
  //   });
  // } else {
  //   totalQuantity = getCartQuantity();
  // }

  return (
    <header className="drop-shadow-header fixed left-0 right-0 top-0 z-20 flex items-center justify-between bg-violet-800 px-4 py-4 font-medium text-slate-50 backdrop-blur sm:gap-10 md:justify-start md:px-10">
      <Link href="/">
        <h3 className="text-2xl font-bold text-amber-400 transition-all duration-300 hover:text-violet-400">
          Azon
        </h3>
      </Link>

      <nav className="flex items-center justify-between gap-6 sm:w-full">
        <NavMain />
        {/* <Search /> */}
        <ul className="relative flex items-center gap-6 md:gap-8">
          <li className="relative">
            <button
              // onClick={toggleCart}
              className="group"
              aria-label="Open Cart"
            >
              <div className="h-7 w-7">
                <CartIcon className="fill-amber-400 transition-all duration-300 hover:fill-violet-400" />
              </div>
            </button>

            <span className="items absolute -bottom-2 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600">
              <span className="text-sm font-bold transition-all duration-300">
                {/* {totalQuantity} */}
              </span>
            </span>
          </li>
          <SignedIn>
            <li>
              <Link href={`/profile`} className="h-fit w-fit">
                <div className="h-7 w-7">
                  <ProfileIcon className="fill-amber-400 hover:fill-violet-400" />
                </div>
              </Link>
            </li>
          </SignedIn>
          <li>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <SignOutButton />
            </SignedIn>
          </li>
        </ul>
      </nav>
    </header>
  );
};
