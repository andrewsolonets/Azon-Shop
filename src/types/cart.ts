import { type Product } from "@prisma/client";

export interface CartItem {
  id: string;
  quantity: number;
}
