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
import { useCart } from "~/context/CartContext";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import Search from "./Search/Search";

// TODO: use client component only when needed - move client side parts to separate comps.

const NavMain = () => {
  const pathname = usePathname();
  const LINKS: { text: string; href: string }[] = [
    { text: "Home", href: "/" },
    { text: "Categories", href: "/categories" },
    { text: "All products", href: "/products" },
  ];

  return (
    <ul className="hidden items-center gap-10 sm:flex">
      {LINKS.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            aria-disabled={pathname === link.href}
            tabIndex={pathname === link.href ? -1 : undefined}
            className={cn(
              "transition-all duration-300 hover:text-violet-300 active:text-amber-300",
              pathname === link.href
                ? "pointer-events-none font-semibold text-amber-400"
                : "",
            )}
          >
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export const Header = () => {
  const { userId } = useAuth();
  const { toggleCart, getCartQuantity } = useCart();

  const { data: cartItems } = api.cart.getCartItems.useQuery(undefined, {
    staleTime: 60 * 1000,
    enabled: !!userId,
  });

  let totalQuantity = 0;

  if (cartItems) {
    cartItems?.forEach((el) => {
      totalQuantity += el?.quantity ?? 0;
    });
  } else {
    totalQuantity = getCartQuantity();
  }

  return (
    <header className="drop-shadow-header sticky left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-violet-800/10 bg-violet-800/30 px-4 py-4 font-medium backdrop-blur-lg sm:gap-10 md:justify-start md:px-10">
      <Link href="/">
        <h3 className="text-2xl font-bold text-amber-400 transition-all duration-300 hover:text-violet-400">
          Azon
        </h3>
      </Link>

      <nav className="flex items-center justify-between gap-6 sm:w-full">
        <NavMain />
        <Search />
        <ul className="relative flex items-center gap-6 md:gap-8">
          <li className="relative">
            <button
              onClick={toggleCart}
              className="group"
              aria-label="Open Cart"
            >
              <div className="h-7 w-7">
                <CartIcon className="fill-amber-400 transition-all duration-300 hover:fill-violet-400" />
              </div>
            </button>

            <span className="items absolute -bottom-2 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600">
              <span className="text-sm font-bold transition-all duration-300">
                {totalQuantity}
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
          <SignedOut>
            <li>
              <SignInButton />
            </li>
          </SignedOut>
        </ul>
      </nav>
    </header>
  );
};
