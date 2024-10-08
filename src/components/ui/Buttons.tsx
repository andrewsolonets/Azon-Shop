import ArrowIcon from "public/img/ArrowIcon";

type Props = {
  children: string;
  onClick: () => void;
  disabled?: boolean | undefined;
};

type ArrowProps = {
  url: string;
  children: string;
};

export const ButtonRegular = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      aria-label={children}
      onClick={onClick}
      className="w-full rounded-lg bg-amber-400 px-5 py-2 font-bold text-violet-700 transition-all duration-300 hover:bg-violet-800 hover:text-amber-400 disabled:bg-violet-500 disabled:hover:text-violet-700"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const BigButton = ({ children, onClick, disabled }: Props) => {
  return (
    <button
      onClick={onClick}
      aria-label={children}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-10 py-2 text-xl font-bold text-violet-700 transition-all duration-150 hover:bg-violet-800 hover:text-amber-400 disabled:bg-violet-500 disabled:hover:text-violet-700 md:w-fit md:justify-start"
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const OutlineBtn = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      aria-label={children}
      className="outline-amber rounded-sm bg-transparent px-3 py-1 text-amber-400 outline outline-2 transition-all duration-300 hover:bg-amber-400/20"
    >
      {children}
    </button>
  );
};

export const ArrowBtn = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      aria-label={children}
      className="group flex w-fit items-center gap-2 rounded-lg bg-amber-400 px-6 py-1 text-xl font-bold text-violet-700 transition-all duration-300 hover:bg-violet-700 hover:text-amber-400 md:px-8 md:py-3 md:text-2xl"
    >
      {children}
      <div className="relative h-7 w-7">
        <ArrowIcon className="fill-violet-700 transition-all duration-300 group-hover:fill-amber-400" />
      </div>
    </button>
  );
};

export const ArrowLinkBtn = ({ url, children }: ArrowProps) => {
  return (
    <a
      href={url}
      aria-label={children}
      className="group flex w-fit items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-2xl font-bold text-violet-700 transition-all duration-300 hover:bg-violet-700 hover:text-amber-400"
    >
      {children}
      <div className="relative h-7 w-7">
        <ArrowIcon className="fill-violet-700 transition-all duration-300 group-hover:fill-amber-400" />
      </div>
    </a>
  );
};
