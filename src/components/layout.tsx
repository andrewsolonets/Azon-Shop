import { type ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="flex w-full flex-col gap-28 bg-violet-700 text-slate-50">
        {children}
      </main>
      <Footer />
    </>
  );
}
