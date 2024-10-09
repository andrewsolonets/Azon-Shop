import Image from "next/image";
import { useRouter } from "next/navigation";
import MinusIcon from "public/img/MinusIcon";
import PlusIcon from "public/img/PlusIcon";
import { useState } from "react";
import { toast } from "react-toastify";
import { FeaturedList } from "~/app/_components/FeaturedList";
import ProductBreadcrumb from "~/components/ProductBreadcrumb";
import { QuantitywCart } from "~/components/QuantitywCart";
import { BigButton } from "~/components/ui/Buttons";
import { ProductReviews } from "~/components/ui/ProductReviews";
import { getFeaturedProducts, getProduct } from "~/server/queries";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export default async function SingleProductPage({
  params: { id: id },
}: {
  params: { id: string };
}) {
  const featured = await getFeaturedProducts();

  // const { addToCartHandler } = useCartActions();

  const item = await getProduct(Number(id));
  if (!item) return;
  const { image, title, price, quantity, categoryId } = item;

  // return (
  //   <>
  //     <Head>
  //       <title>{title}</title>
  //     </Head>

  //   </>
  // );
  return (
    <section className="flex h-fit flex-col gap-12 px-4 py-4 md:px-8">
      <ProductBreadcrumb product={item} />
      <div className="flex w-full flex-col items-center justify-between gap-20 md:flex-row md:items-start">
        <div className="relative h-72 w-72 rounded-lg border-8 border-amber-400 object-cover">
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
          <h1 className="text-4xl font-semibold md:max-w-md">{title}</h1>
          <QuantitywCart product={item} />

          <Accordion
            className="text-left"
            defaultValue={["item-1"]}
            type="multiple"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">
                Description
              </AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur. Tortor consequat commodo
                facilisis quam dictumst ut magna pharetra. Turpis malesuada enim
                sit non dui suspendisse lectus. Vehicula ut consectetur proin
                justo non metus. Mauris egestas euismod turpis arcu at bibendum
                risus aliquam. Ornare pulvinar pretium nunc ante. Sed faucibus
                pretium et id.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">
                Key Benefits
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-inside list-disc">
                  <li>Lorem ipsum dolor</li>
                  <li>Turpis malesuada enim sit non dui</li>
                  <li>Vehicula ut consectetur proin</li>
                  <li>Turpis arcu at bibendum</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <ProductReviews reviews={item.reviews} />
      <FeaturedList items={featured} />
    </section>
  );
}
