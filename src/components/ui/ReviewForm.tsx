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
import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { schema } from "~/app/reviewSchema";

// TODO: try shadcn forms
export const ReviewForm = ({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { id } = useParams();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      heading: "",
      message: "",
      rating: 5,
      productId: Number(id),
    },
  });

  // const sessionData = auth();

  const userId = false;
  // const { addReview } = useReviewActions();
  const [rating, setRating] = useState(0);

  // const submitCallback = async (e: FormEvent<HTMLFormElement>) => {
  //   if (!id) return;
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget); // Create a new FormData object

  //   console.log(e.target.elements);
  //   // // @ts-ignore
  //   // const username = e.target.elements?.username?.value;
  //   // //@ts-ignore
  //   // const heading = e.target.elements.heading.value;
  //   // //@ts-ignorev
  //   // const message = e.target.elements.message.value;
  //   // console.log(username, heading, message, rating);

  //   // formData.append("username", username);
  //   // formData.append("heading", heading);
  //   // formData.append("message", message);
  //   formData.append("productId", Number(id));
  //   formData.append("rating", rating);
  //   // TODO: Update UI on review added
  //   const response = await fetch("/api/sendReview", {
  //     method: "POST",
  //     body: formData,
  //   });
  //   if (response.ok) {
  //     toast.success("Review Added!");
  //   }
  //   setRating(0);

  //   setIsOpen(false);
  //   //@ts-ignore
  //   e.target.reset();
  // };

  async function onSubmit(values: z.infer<typeof schema>) {
    const { username, heading, message } = values;
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const formData = new FormData(); // Create a new FormData object

    formData.append("username", username);
    formData.append("heading", heading);
    formData.append("message", message);

    formData.append("productId", id as string);
    formData.append("rating", rating.toString());
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
    console.log(values);
    toast.success("Review submitted successfuly!");
    form.reset();
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex w-full flex-col items-center gap-7 self-center py-2 md:w-1/2"
        // onSubmit={submitCallback}
      >
        <h4 className="w-fit self-start rounded-md bg-violet-600 px-4 py-1 font-semibold drop-shadow-sm md:ml-4">
          New Review
        </h4>

        {userId ? null : (
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="relative w-full">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Tom" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="heading"
          render={({ field }) => (
            <FormItem className="relative w-full">
              <FormLabel>Heading</FormLabel>
              <FormControl>
                <Input placeholder="Loved it!" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

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
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="relative w-full">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Message" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
