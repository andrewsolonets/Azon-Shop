import Link from "next/link";
import { useRouter } from "next/router";

export const NavMain = () => {
  const router = useRouter();
  return (
    <ul className="hidden items-center gap-10 sm:flex">
      <li>
        <Link
          href="/"
          className={`
      transition-all duration-300 hover:text-violet-300 active:text-amber-300 ${
        router.pathname == "/"
          ? "font-semibold text-amber-400 "
          : "text-slate-50 "
      }`}
        >
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/categories"
          className={`
      transition-all duration-300 hover:text-violet-300 active:text-amber-300 ${
        router.pathname == "/categories"
          ? "font-semibold text-amber-400 "
          : "text-slate-50 "
      }`}
        >
          Categories
        </Link>
      </li>
      <li className="w-max">
        <Link
          href="/products"
          className={`
      transition-all duration-300 hover:text-violet-300 active:text-amber-300 ${
        router.pathname == "/products"
          ? "font-semibold text-amber-400 "
          : "text-white "
      }`}
        >
          All Products
        </Link>
      </li>
    </ul>
  );
};
