import { randBetweenDate, randNumber, randProduct } from "@ngneat/falso";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import algoliasearch from "algoliasearch/lite";

const prisma = new PrismaClient();

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.ADMIN_ALGOLIA_KEY as string
);

const main = async () => {
  try {
    await prisma.category.deleteMany();
    await prisma.product.deleteMany();
    const fakeProducts = randProduct({
      length: 1000,
    });
    for (let index = 0; index < fakeProducts.length; index++) {
      const product = fakeProducts[index];
      const name = faker.commerce.productName();
      await prisma.product.upsert({
        where: {
          title: name,
        },
        create: {
          title: name,
          description: product?.description || "hello world",
          price: faker.commerce.price(),
          image: faker.image.abstract(640, 480, true),
          quantity: randNumber({ min: 10, max: 100 }),
          category: {
            connectOrCreate: {
              where: {
                name: product?.category,
              },
              create: {
                name: product?.category || "category",
                createdAt: randBetweenDate({
                  from: new Date("10/06/2020"),
                  to: new Date(),
                }),
              },
            },
          },
          createdAt: randBetweenDate({
            from: new Date("10/07/2020"),
            to: new Date(),
          }),
        },
        update: {},
      });
    }

    /*
     ALGOLIA UPDATE DATA BASED ON CURRENT PRODUCTS (CAN BE USED SEPARATELY)
     You can both add new items with this as well as update existing ones. If objectID matches the existing one, it will be updated.
     See https://www.algolia.com/doc/api-client/methods/indexing/ for how to manipulate data (delete, update, replace etc.)
    */

    const allProducts = await prisma.product.findMany();

    // CHANGE TO YOUR INDEX NAME
    const index = client.initIndex("azon1");
    const objectsToAdd = allProducts?.map((el) => ({
      ...el,
      objectID: el?.id,
      name: el?.title,
    }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore

    index.saveObjects(objectsToAdd).then(({ objectIDs }) => {
      console.log(objectIDs);
    });
  } catch (error) {
    throw error;
  }
};

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
