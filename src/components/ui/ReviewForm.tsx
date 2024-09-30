"use client";
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Rating } from "@smastrom/react-rating";

import {
  type FormEvent,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { RatingStyles } from "./ProductCard";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

// TODO: try shadcn forms
export const ReviewForm = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { id } = useParams();
  // const sessionData = auth();

  const userId = false;
  // const { addReview } = useReviewActions();
  const [rating, setRating] = useState(0);

  const submitCallback = async (e: FormEvent<HTMLFormElement>) => {
    if (!id) return;
    e.preventDefault();
    const formData = new FormData(e.currentTarget); // Create a new FormData object

    console.log(e.target.elements);
    // // @ts-ignore
    // const username = e.target.elements?.username?.value;
    // //@ts-ignore
    // const heading = e.target.elements.heading.value;
    // //@ts-ignorev
    // const message = e.target.elements.message.value;
    // console.log(username, heading, message, rating);

    // formData.append("username", username);
    // formData.append("heading", heading);
    // formData.append("message", message);
    formData.append("productId", Number(id));
    formData.append("rating", rating);
    // TODO: Update UI on review added
    const response = await fetch("/api/sendReview", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      toast.success("Review Added!");
    }
    setRating(0);
  

    setIsOpen(false);
    //@ts-ignore
    e.target.reset();
  };
  return (
    <form
      className="flex w-full flex-col items-center gap-7 self-center py-2 md:w-1/2"
      onSubmit={submitCallback}
    >
      <h4 className="w-fit self-start rounded-md bg-violet-600 px-4 py-1 font-semibold drop-shadow-sm md:ml-4">
        New Review
      </h4>
      <input aria-hidden="true" type="hidden" name="botfield" />

      {userId ? null : (
        <div className="relative w-full">
          <input
            // If not logged in
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            required
            className="form-input peer w-full rounded-lg border-none bg-violet-600 placeholder-transparent outline-none focus:ring-0"
            // onChange={(e) => handleChange(e)}
          />
          <label
            htmlFor="username"
            className="absolute -top-5 left-3 text-sm text-gray-300 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-300"
          >
            Username
          </label>
        </div>
      )}
      <div className="relative w-full">
        <input
          id="heading"
          type="text"
          required
          placeholder="Heading"
          name="heading"
          className="form-input peer w-full rounded-lg border-none bg-violet-600 placeholder-transparent outline-none focus:ring-0"
          // onChange={(e) => handleChange(e)}
        />
        <label
          htmlFor="heading"
          className="absolute -top-5 left-3 text-sm text-gray-300 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:-top-5 peer-focus:text-sm peer-focus:text-gray-300"
        >
          Heading
        </label>
      </div>
      <div className="flex gap-4 text-xl text-gray-300">
        <h6>Rating</h6>
        <div className="w-36">
          <Rating
            value={rating}
            onChange={setRating}
            itemStyles={RatingStyles}
          />
        </div>
      </div>
      <div className="relative w-full">
        <textarea
          id="message"
          name="message"
          placeholder="Message"
          rows={10}
          required
          className="peer w-full rounded-lg border-none bg-violet-600 placeholder-transparent outline-none focus:outline-none"
        />
        <label
          htmlFor="message"
          className="absolute -top-5 left-3 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:-top-5 peer-focus:text-sm"
        >
          Message
        </label>
      </div>
      <button
        className="w-full rounded-lg bg-amber-400 px-5 py-2 font-bold text-violet-700 transition-all duration-300 hover:bg-violet-800 hover:text-amber-400"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};
