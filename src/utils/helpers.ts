import { type Product, type CartItem, type Cart } from "@prisma/client";
import { toast } from "react-toastify";
import { type CartItemGuest } from "../types/cart";
// import onClickOutside from "react-onclickoutside";

interface CartItemLong extends CartItem {
  product: { title: string; image: string; price: number; description: string };
}

export type CartItemPlus = {
  cart: Cart;
  product: Product;
  id: string;
  quantity: number;
  cartId: string;
};

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
      unit_amount: Math.floor(item.product.price) * 100,
      product_data: {
        name: item.product.title,
        description: item.product.description,
        images: [item.product.image],
      },
    },

    quantity: item.quantity,
  }));
};

export const paymentNotification = (status: string | string[]) => {
  if (status === "cancel") {
    toast.error("Payment Canceled!", {
      position: "top-center",
      autoClose: 3500,
    });
  }
  if (status === "success") {
    toast.success("Payment Successful!", {
      position: "top-center",
      autoClose: 3500,
    });
  }
};

export const getTotalAmount = (
  items: CartItemPlus[] | CartItemGuest[] | undefined
) => {
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
