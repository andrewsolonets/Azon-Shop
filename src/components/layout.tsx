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
      <main className="bg-violet-700 text-white">{children}</main>
      <Footer />
    </>
  );
}
