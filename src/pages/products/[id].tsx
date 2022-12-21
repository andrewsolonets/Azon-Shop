import { type Product } from "@prisma/client";
import Image from "next/image";
import PlusIcon from "../../assets/PlusIcon";
import MinusIcon from "../../assets/MinusIcon";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useState } from "react";
import { BigButton } from "../../components/Buttons";
import { useCartActions } from "../../hooks/useCartActions";
import { FeaturedList } from "../../components/FeaturedList";

const SingleProductPage = () => {
  const router = useRouter();
  const featured = trpc.product.getAll.useQuery(20);
  const [quantityCounter, setQuantity] = useState(1);
  const { addToCartHandler } = useCartActions();
  if (!router.query) return;
  const { id } = router.query as { id: string };
  const item = trpc.product.getOne.useQuery(id) as { data: Product };
  if (!item.data) return;
  const { image, title, price } = item.data;
  const finalPrice = Math.round(Number(price));
  return (
    <section className="mt-32 flex h-fit flex-col gap-24 py-4 px-8">
      <div className=" flex w-full flex-col items-center justify-between gap-20 md:flex-row md:items-start">
        <div className="relative h-72 w-72 rounded-sm object-cover ring-8 ring-amber-400">
          <Image src={image} alt={title} fill />
        </div>
        <div className="flex w-full flex-col gap-8 text-center md:w-[80%] md:text-left">
          <h2 className="max-w-sm  text-4xl font-semibold ">{title}</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Tortor consequat commodo
            facilisis quam dictumst ut magna pharetra. Turpis malesuada enim sit
            non dui suspendisse lectus. Vehicula ut consectetur proin justo non
            metus. Mauris egestas euismod turpis arcu at bibendum risus aliquam.
            Ornare pulvinar pretium nunc ante. Sed faucibus pretium et id.
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
                  onClick={() => setQuantity((prev) => (prev -= 1))}
                >
                  <MinusIcon className="fill-amber-400 hover:fill-violet-400 " />
                </button>

                <input
                  type="text"
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  value={quantityCounter}
                  className="relative w-10 rounded-md bg-violet-800 px-2 py-1 text-center text-xl font-bold"
                />
                <button
                  className="h-5 w-5"
                  onClick={() => setQuantity((prev) => (prev += 1))}
                >
                  <PlusIcon className="fill-amber-400 hover:fill-violet-400 " />
                </button>
              </div>
            </div>
            <BigButton
              onClick={() => addToCartHandler(item.data, quantityCounter)}
            >
              Add to Cart
            </BigButton>
          </div>
        </div>
      </div>
      <FeaturedList items={featured.data} />
    </section>
  );
};

// export const getServerSideProps: GetStaticProps = (ctx) => {
//   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//   const id = ctx?.params?.id;
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   const item = trpc.product.getOne.useQuery(id);
//   console.log(item);
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// };

export default SingleProductPage;
