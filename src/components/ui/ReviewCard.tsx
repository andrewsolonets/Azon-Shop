"use client";

import { Rating } from "@smastrom/react-rating";
import { RatingStyles } from "./ProductCard";

type ReviewProps = {
  title: string;
  author: string | null;
  date: Date;
  text: string;
  rating: number;
};

export const ReviewCard = ({
  title,
  author,
  date,
  text,
  rating,
}: ReviewProps) => {
  // return (
  //   <div className="flex w-full flex-col overflow-hidden rounded-lg bg-violet-600 drop-shadow-xl">
  //     <div className="flex w-full items-center justify-between gap-2 border-b-2 border-slate-400/20 px-8 py-4">
  //       <div className="flex items-center gap-4">
  //         <div className="h-12 w-12 rounded-full bg-violet-500"></div>
  //         <h2 className="text-lg">{author}</h2>
  //       </div>

  //       <p>{dateString}</p>
  //     </div>
  //     <div className="flex w-full flex-col items-start gap-4 p-8">
  //       <div className="flex flex-col gap-4 md:flex-row">
  //         <div className="w-28">
  //           <Rating value={rating} itemStyles={RatingStyles} readOnly />
  //         </div>
  //         <h3 className="text-xl font-semibold">{title}</h3>
  //       </div>
  //       <p>{text}</p>
  //     </div>
  //   </div>
  // );
  return (
    <div className="flex h-fit flex-col gap-6 rounded-xl border-2 border-violet-500 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="w-28">
            <Rating value={rating} itemStyles={RatingStyles} readOnly />
          </div>
          <h4 className="font-heading text-lg font-bold">{title}</h4>
        </div>
        <p>{text}</p>
        {/* {text2 && <p className="leading-relaxed">{text2}</p>} */}
      </div>
      <div className="flex flex-col">
        <h6 className="font-heading font-medium tracking-tight">{author}</h6>
        <p className="text-sm font-medium text-violet-400">Customer</p>
      </div>
    </div>
  );
};
