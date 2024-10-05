"use client";

import { OrderModel } from "~/server/db/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export default function UserOrders({ orders }: { orders: OrderModel[] }) {
  // return (

  //   <table className="w-full table-auto border-separate border-spacing-y-2 text-left">
  //     <thead>
  //       <tr className="[&>*]:p-4">
  //         <th>Date</th>
  //         <th>Total Amount</th>
  //         <th>Status</th>
  //       </tr>
  //     </thead>
  //     <tbody className="">
  //       {orders?.map((el) => (
  //         <tr className="rounded-xl bg-violet-800 [&>*]:p-4" key={el.id}>
  //           <td>{el.createdAt.toDateString()}</td>
  //           <td>${el?.totalAmount ? el?.totalAmount / 100 : ""}</td>
  //           <td>{el.status}</td>
  //         </tr>
  //       ))}
  //     </tbody>
  //   </table>
  // );
  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Date</TableHead>
          <TableHead>Status</TableHead>

          <TableHead className="text-right">Total Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders?.map((el) => (
          <TableRow key={el.id}>
            <TableCell>{el.createdAt.toDateString()}</TableCell>
            <TableCell>{el.status}</TableCell>
            <TableCell className="text-right">
              ${el?.totalAmount ? el?.totalAmount / 100 : ""}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
