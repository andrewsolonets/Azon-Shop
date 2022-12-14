import { type Product, type CartItem } from "@prisma/client";

interface CartItemLong extends CartItem {
  product: { title: string; image: string; price: number; description: string };
}

interface CartItemPlus extends CartItem {
  product: Product;
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

export const getTotalAmount = (items: CartItemPlus[] | undefined) => {
  let total = 0;
  items?.forEach((item) => {
    const itemTotal = item.quantity * Number(item.product.price);
    total += itemTotal;
  });
  return total;
};
