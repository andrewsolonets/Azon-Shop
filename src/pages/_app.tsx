import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@fontsource/inter";

import "../styles/globals.css";
import Layout from "../components/layout";
import { CartProvider } from "../hooks/useCartActions";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </Layout>
      </CartProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
