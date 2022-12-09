import { type CartItem } from "@prisma/client";

interface CartItemLong extends CartItem {
  product: { title: string; image: string; price: number; description: string };
}

export const tranformCartItems = (items: CartItemLong[]) => {
  return items.map((item) => ({
    price_data: {
      currency: "usd",
      unit_amount: Math.floor(item.product.price),
      product_data: {
        name: item.product.title,
        description: item.product.description,
        images: [item.product.image],
      },
    },

    quantity: item.quantity,
  }));
};
