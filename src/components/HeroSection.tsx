import { ArrowLinkBtn } from "./Buttons";

export const HeroSection = () => {
  return (
    <section className=" mt-16  py-11">
      <div className="relative flex h-fit  w-full flex-col gap-10 bg-[url(../assets/hero.png)] bg-center p-10">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-extrabold ">Welcome to Azon</h1>
          <p className="text-2xl font-medium">Demo ecommerce app</p>
        </div>
        <ArrowLinkBtn url="#">Shop now</ArrowLinkBtn>
      </div>
    </section>
  );
};
