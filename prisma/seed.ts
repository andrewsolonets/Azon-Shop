import {
  randBetweenDate,
  randNumber,
  randProduct,
  randProductAdjective,
} from "@ngneat/falso";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const primsa = new PrismaClient();

const main = async () => {
  try {
    await primsa.category.deleteMany();
    await primsa.product.deleteMany();
    const fakeProducts = randProduct({
      length: 1000,
    });
    for (let index = 0; index < fakeProducts.length; index++) {
      const product = fakeProducts[index];
      const name = faker.commerce.productName();
      const productAdjective = randProductAdjective();
      await primsa.product.upsert({
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
  } catch (error) {
    throw error;
  }
};

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
