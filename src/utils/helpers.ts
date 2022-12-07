import { type CartItem } from "@prisma/client";

interface CartItemLong extends CartItem {
  product: { title: string; image: string; price: number; description: string };
}

export const tranformCartItems = (items: CartItemLong[]) => {
  return items.map((item) => ({
    currency: "PLN",
    images: [item.product.image],
    name: item.product.title,
    amount: Math.floor(item.product.price),
    description: item.product.description,
    quantity: item.quantity,
  }));
};
