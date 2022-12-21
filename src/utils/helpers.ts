import { type Product, type CartItem } from "@prisma/client";
import { type MutableRefObject } from "react";
// import onClickOutside from "react-onclickoutside";

interface CartItemLong extends CartItem {
  product: { title: string; image: string; price: number; description: string };
}

interface CartItemPlus extends CartItem {
  product: Product;
}

// function listenForOutsideClicks(
//   listening: boolean,
//   setListening: (val: boolean) => void,
//   menuRef: MutableRefObject<null>,
//   setIsOpen: (val: boolean) => void
// ) {
//   return () => {
//     if (listening) return;
//     if (!menuRef.current) return;
//     setListening(true);
//     [`click`, `touchstart`].forEach((type) => {
//       document.addEventListener(`click`, (evt) => {
//         if (menuRef.current?.contains(evt.target)) return;
//         setIsOpen(false);
//       });
//     });
//   };
// }

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

// <CartItemCard
// item={{
//   product: {
//     title: "Hello",
//     price: "1212",
//     id: "sddjsds",
//     description: "dsdskdj",
//     quantity: 1,
//     image: "https://placeimg.com/1000/1000/tech",
//     createdAt: new Date("December 17, 1995 03:24:00"),
//     categoryId: "dskdlskdl",
//   },
//   id: "oqpwoepqwoepqwo",
//   productId: "sdjskjdksjdks",
//   quantity: 5,
//   cartId: "sjdksjdkj",
// }}
// />
