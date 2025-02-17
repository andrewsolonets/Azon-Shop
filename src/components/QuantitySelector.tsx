import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const QuantitySelector = ({
  quantity,
  changeQuantity,
  available,
}: {
  quantity: number;
  changeQuantity: (newQuantity: number) => void;
  available: number;
}) => {
  return (
    <div>
      <Select
        onValueChange={(str: string) => changeQuantity(Number(str))}
        value={quantity.toString()}
      >
        <span className="mb-1 block">Quantity</span>
        <SelectTrigger>
          <SelectValue placeholder="Select quantity" />
        </SelectTrigger>
        <SelectContent>
          {Array.from(Array(available).keys()).map((i) => {
            const num = i + 1;
            return (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
