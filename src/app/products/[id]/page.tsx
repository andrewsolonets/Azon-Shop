import Image from "next/image";
import { useRouter } from "next/navigation";
import MinusIcon from "public/img/MinusIcon";
import PlusIcon from "public/img/PlusIcon";
import { useState } from "react";
import { toast } from "react-toastify";
import { FeaturedList } from "~/app/_components/FeaturedList";
import { QuantitywCart } from "~/components/QuantitywCart";
import { BigButton } from "~/components/ui/Buttons";
import { ProductReviews } from "~/components/ui/ProductReviews";
import { getFeaturedProducts, getProduct } from "~/server/queries";

export default async function SingleProductPage({
  params: { id: id },
}: {
  params: { id: string };
}) {
  const featured = await getFeaturedProducts();

  // const { addToCartHandler } = useCartActions();

  const item = await getProduct(Number(id));
  if (!item) return;
  const { image, title, price, quantity } = item;

  // return (
  //   <>
  //     <Head>
  //       <title>{title}</title>
  //     </Head>

  //   </>
  // );
  return (
    <section className="mt-32 flex h-fit flex-col gap-24 px-4 py-4 md:px-8">
      <div className="flex w-full flex-col items-center justify-between gap-20 md:flex-row md:items-start">
        <div className="b- border- relative h-72 w-72 rounded-lg border-8 border-amber-400 object-cover">
          <Image
            // changed image to static for data saving
            // src={image}
            src={"/img/product.webp"}
            alt={title ?? "invalid image"}
            className="object-cover"
            fill
            sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
          />
        </div>
        <div className="flex w-full flex-col gap-8 text-center md:w-[80%] md:text-left">
          <h2 className="text-4xl font-semibold md:max-w-md">{title}</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur. Tortor consequat commodo
            facilisis quam dictumst ut magna pharetra. Turpis malesuada enim sit
            non dui suspendisse lectus. Vehicula ut consectetur proin justo non
            metus. Mauris egestas euismod turpis arcu at bibendum risus aliquam.
            Ornare pulvinar pretium nunc ante. Sed faucibus pretium et id.
          </p>
          <QuantitywCart product={item} />
        </div>
      </div>
      <ProductReviews reviews={item.reviews} />
      <FeaturedList items={featured} />
    </section>
  );
}
