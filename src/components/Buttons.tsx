import ArrowIcon from "../assets/ArrowIcon";

type Props = {
  children: string;
  onClick: () => void;
};

type ArrowProps = {
  url: string;
  children: string;
};

export const ButtonRegular = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg bg-amber-400 px-5 py-2 font-bold text-violet-700 transition-all duration-300 hover:bg-violet-700 hover:text-amber-400"
    >
      {children}
    </button>
  );
};

export const BigButton = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="flex w-fit items-center gap-2 rounded-lg bg-amber-400 px-10 py-2 text-xl font-bold text-violet-700 transition-all duration-150 hover:bg-violet-700 hover:text-amber-400"
    >
      {children}
    </button>
  );
};

export const OutlineBtn = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="outline-amber rounded-sm bg-transparent px-3 py-1  text-amber-400  outline outline-2 transition-all duration-300 hover:bg-amber-400/20"
    >
      {children}
    </button>
  );
};

export const ArrowBtn = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="group flex w-fit items-center gap-2 rounded-lg bg-amber-400 px-8 py-3 text-2xl font-bold text-violet-700 transition-all duration-300 hover:bg-violet-700 hover:text-amber-400 "
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
      className="group flex w-fit items-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-2xl font-bold text-violet-700 transition-all duration-300 hover:bg-violet-700 hover:text-amber-400"
    >
      {children}
      <div className="relative h-7 w-7">
        <ArrowIcon className="fill-violet-700 transition-all duration-300 group-hover:fill-amber-400" />
      </div>
    </a>
  );
};
