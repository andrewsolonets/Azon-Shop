import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const prisma = new PrismaClient();

const main = async () => {
  try {
    const products = await prisma.product.findMany();
    products.forEach(async (product) => {
      const quantity = 3;
      const { id } = product;
      for (let i = 0; i < quantity; i++) {
        const name = faker.name.fullName();
        const heading = `${faker.commerce.productAdjective()} ${faker.lorem.sentence(
          2
        )}`;
        const message = faker.lorem.sentences(2);
        const rating = randomIntFromInterval(3, 5);
        const createdAt = faker.date.between(
          "2020-01-01T00:00:00.000Z",
          "2022-12-01T00:00:00.000Z"
        );
        await prisma?.ratings.create({
          data: {
            product: { connect: { id } },
            userName: name,
            heading,
            message,
            rating,
            createdAt,
          },
        });
      }
    });
  } catch (error) {
    throw error;
  }
};

main().catch((err) => {
  console.warn("Error While generating Seed: \n", err);
});
