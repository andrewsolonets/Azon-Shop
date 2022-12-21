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
      <div className="relative flex h-fit  w-full flex-col gap-10 bg-[url(../assets/hero.png)] bg-center p-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-extrabold ">Welcome to Azon</h1>
          <p className="text-2xl font-medium">
            Demo ecommerce app. Please
            <span className="font-bold uppercase text-amber-400">
              {" "}
              sign in{" "}
            </span>
            to get started
          </p>
        </div>
        <ArrowLinkBtn url="/products">Shop now</ArrowLinkBtn>
      </div>
    </section>
  );
};
