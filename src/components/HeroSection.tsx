import { useRouter } from "next/router";
import { paymentNotification } from "../utils/helpers";
import { ArrowLinkBtn } from "./Buttons";
import { useEffect } from "react";

export const HeroSection = () => {
  const router = useRouter();
  const { status } = router.query;
  useEffect(() => {
    if ((status && status === "cancel") || status === "success") {
      paymentNotification(status);
    }
  }, [status]);

  return (
    <section className=" mt-16 flex flex-col items-center py-11">
      <div className="relative flex h-fit w-full flex-col items-center gap-10 bg-[url(../../public/static/img/hero.png)] bg-center px-4 py-10 md:items-start md:p-10">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <h1 className="text-center text-5xl font-extrabold md:text-left">
            Welcome to Azon
          </h1>
          <p className="text-2xl font-medium">Demo ecommerce app.</p>
        </div>
        <ArrowLinkBtn url="/products">Shop now</ArrowLinkBtn>
      </div>
    </section>
  );
};
