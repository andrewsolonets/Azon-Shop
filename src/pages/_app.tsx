import { SessionProvider } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import Layout from "../components/layout";
import { CartProvider } from "../context/CartContext";

import "@fontsource/inter";
import "@algolia/autocomplete-theme-classic";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "@smastrom/react-rating/style.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            theme="colored"
          />
          <ReactQueryDevtools />
        </Layout>
      </CartProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
