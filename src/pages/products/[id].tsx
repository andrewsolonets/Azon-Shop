import { type Product } from "@prisma/client";
import Image from "next/image";
import PlusIcon from "../../../public/static/img/PlusIcon";
import MinusIcon from "../../../public/static/img/MinusIcon";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { useState } from "react";
import { BigButton } from "../../components/Buttons";
import { useCartActions } from "../../hooks/useCartActions";
import { FeaturedList } from "../../components/FeaturedList";
import Head from "next/head";
import { ProductReviews } from "../../components/ProductReviews";
import { toast } from "react-toastify";

const SingleProductPage = () => {
  const router = useRouter();
  const featured = api.product.getAll.useQuery(20);
  const [quantityCounter, setQuantity] = useState(1);
  const { addToCartHandler } = useCartActions();
  if (!router.query) return;
  const { id } = router.query as { id: string };
  const item = api.product.getOne.useQuery(id) as { data: Product };
  if (!item.data) return;
  const { image, title, price, quantity } = item.data;
  const finalPrice = Math.round(Number(price));
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <section className="mt-32 flex h-fit flex-col gap-24 py-4 px-4 md:px-8">
        <div className=" flex w-full flex-col items-center justify-between gap-20 md:flex-row md:items-start">
          <div className="b- border- relative h-72 w-72 rounded-lg border-8 border-amber-400 object-cover">
            <Image
              src={image}
              alt={title}
              className="object-cover"
              fill
              sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
            />
          </div>
          <div className="flex w-full flex-col gap-8 text-center md:w-[80%] md:text-left">
            <h2 className="max-w-sm  text-4xl font-semibold ">{title}</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur. Tortor consequat commodo
              facilisis quam dictumst ut magna pharetra. Turpis malesuada enim
              sit non dui suspendisse lectus. Vehicula ut consectetur proin
              justo non metus. Mauris egestas euismod turpis arcu at bibendum
              risus aliquam. Ornare pulvinar pretium nunc ante. Sed faucibus
              pretium et id.
            </p>
            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <div className="flex flex-col items-center gap-1">
                <span>Price</span>
                <span className="text-2xl font-bold">${finalPrice}</span>
              </div>
              <div className=" relative flex flex-col  items-center gap-1">
                <span>Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    className="h-5 w-5"
                    onClick={() => {
                      if (quantityCounter > 0) {
                        setQuantity((prev) => (prev -= 1));
                      }
                    }}
                  >
                    <MinusIcon className="fill-amber-400 hover:fill-violet-400 " />
                  </button>

                  <input
                    type="text"
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    value={quantityCounter}
                    className="relative w-10 rounded-md border-0 bg-violet-800 px-2 py-1 text-center text-xl font-bold"
                  />
                  <button
                    className="h-5 w-5"
                    onClick={() =>
                      setQuantity((prev) => {
                        if (prev < quantity) {
                          return (prev += 1);
                        } else {
                          toast.info(
                            `Maxed out (only ${quantity} items available)`
                          );
                          return prev;
                        }
                      })
                    }
                  >
                    <PlusIcon className="fill-amber-400 hover:fill-violet-400 " />
                  </button>
                </div>
              </div>
              <BigButton
                onClick={() => addToCartHandler(item.data, quantityCounter)}
                disabled={quantity < 1}
              >
                Add to Cart
              </BigButton>
            </div>
          </div>
        </div>
        <ProductReviews />
        <FeaturedList items={featured.data} />
      </section>
    </>
  );
};

// export const getServerSideProps: GetStaticProps = (ctx) => {
//   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   const id = ctx?.params?.id;
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   const item = api.product.getOne.useQuery(id);
//   console.log(item);
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// };

export default SingleProductPage;
