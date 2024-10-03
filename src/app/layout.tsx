import "~/styles/globals.css";
import "@smastrom/react-rating/style.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Footer } from "~/components/Footer";
import { Toaster } from "~/components/ui/sonner";
import { Header } from "~/components/Header";
import { CartProvider } from "~/context/CartContext";

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// TODO: Put metadata to each page in the app
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <TRPCReactProvider>
            <CartProvider>
              <Header />
            </CartProvider>
            <main>{children}</main>
            <Footer />
            <Toaster />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
