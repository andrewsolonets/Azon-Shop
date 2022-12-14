import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@fontsource/inter";

import "../styles/globals.css";
import Layout from "../components/layout";
import { Cart } from "../components/Cart";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
        <ReactQueryDevtools />
      <Cart />
      </Layout>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
