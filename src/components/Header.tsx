import CartIcon from "../assets/cart.svg";

export const Header = () => {
  return (
    <header className="drop-shadow-header fixed top-0 left-0 right-0 z-50 flex items-center gap-10 bg-violet-800 py-4 px-10 font-medium text-white  backdrop-blur">
      <h3 className="text-2xl font-bold text-amber-400">Azon</h3>
      <nav className="flex w-full items-center justify-between">
        <ul className="flex items-center gap-10">
          <li>Home</li>
          <li>Shop</li>
        </ul>
        <ul className="flex items-center gap-16">
          <li className="relative h-7 w-7">
            <CartIcon />
            <span className="items absolute -bottom-2 -right-3 flex h-6 w-6 items-center justify-center rounded-full bg-violet-700">
              <span className="text-xs font-bold">10</span>
            </span>
          </li>
          <li>
            <a
              href="#"
              target="_blank"
              className="outline-ambtext-amber-400 hover:bg-ambtext-amber-400 rounded-sm bg-transparent px-4 py-1 text-amber-400 outline outline-2 transition-all duration-300 hover:bg-opacity-10"
            >
              Sign in
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
