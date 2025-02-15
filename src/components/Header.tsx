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
import { HamburgerMenuIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "~/utils/constants";

// TODO: use client component only when needed - move client side parts to separate comps.

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on path change
  useEffect(() => setIsMenuOpen(false), [pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on ESC press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="h-7 w-7" ref={menuRef}>
      <button
        data-cy="mobile-menu-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-amber-400 hover:text-violet-400"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      >
        <HamburgerMenuIcon className="h-7 w-7" />
      </button>

      <div
        data-cy="mobile-menu"
        className={cn(
          "fixed inset-0 z-50 h-screen w-full bg-violet-800/95 backdrop-blur-lg",
          "transition-all duration-300 ease-in-out",
          "transform-gpu",
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "hidden translate-x-full opacity-0",
        )}
        style={{ pointerEvents: isMenuOpen ? "auto" : "none" }}
      >
        <div
          data-cy="mobile-nav-links"
          className="flex h-full flex-col items-center justify-center space-y-8"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-3xl font-medium transition-colors",
                pathname === link.href
                  ? "text-amber-400"
                  : "text-white hover:text-violet-300",
              )}
            >
              {link.text}
            </Link>
          ))}

          <button
            data-cy="mobile-menu-close"
            onClick={() => setIsMenuOpen(false)}
            className="absolute right-6 top-6 text-amber-400 hover:text-violet-400"
            aria-label="Close menu"
          >
            <Cross2Icon className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
};
const NavMain = () => {
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-10 md:flex">
      {NAV_LINKS.map((link) => (
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
    <header className="drop-shadow-header sticky left-0 right-0 top-0 z-20 flex items-center justify-between gap-6 border-b border-violet-800/10 bg-violet-800/30 px-4 py-4 font-medium backdrop-blur-lg md:justify-start md:gap-10 md:px-10">
      <Link href="/">
        <h3
          data-cy="header-logo"
          className="text-2xl font-bold text-amber-400 transition-all duration-300 hover:text-violet-400"
        >
          Azon
        </h3>
      </Link>

      <nav className="flex w-full items-center justify-between gap-6">
        <NavMain />
        <Search />
        <ul className="relative flex items-center gap-6 md:gap-8">
          <li className="relative">
            <button
              data-cy="cart-button"
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
          <li className="md:hidden">
            <MobileMenu />
          </li>
        </ul>
      </nav>
    </header>
  );
};
