import { type Product } from "@prisma/client";
import Image from "next/image";
import AddIcon from "../../assets/plus.svg";
import MinusIcon from "../../assets/minus.svg";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useState } from "react";
import { BigButton } from "../../components/Buttons";
import { useCartActions } from "../../hooks/useCartActions";

const SingleProductPage = () => {
  const router = useRouter();
  const [quantityCounter, setQuantity] = useState(1);
  const { addToCartHandler } = useCartActions();
  if (!router.query) return;
  const { id } = router.query as { id: string };
  const item = trpc.product.getOne.useQuery(id) as { data: Product };
  if (!item.data) return;
  const { image, title, price } = item.data;
  const finalPrice = Math.round(Number(price));
  return (
    <section className="mt-32 py-4 px-8">
      <div className=" flex w-full justify-between gap-20">
        <div className="relative h-72 w-72 rounded-sm object-cover ring-8 ring-amber-400">
          <Image src={image} alt={title} fill />
        </div>
        <div className="flex w-[80%] flex-col gap-8">
          <h2 className="font-semifold max-w-sm text-4xl">{title}</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Tortor consequat commodo
            facilisis quam dictumst ut magna pharetra. Turpis malesuada enim sit
            non dui suspendisse lectus. Vehicula ut consectetur proin justo non
            metus. Mauris egestas euismod turpis arcu at bibendum risus aliquam.
            Ornare pulvinar pretium nunc ante. Sed faucibus pretium et id.
          </p>
          <div className="flex justify-between">
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
                  <MinusIcon />
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
                  <AddIcon />
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
