import { randBetweenDate, randNumber, randProduct } from "@ngneat/falso";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  } catch (error) {
    throw error;
  }
};

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
