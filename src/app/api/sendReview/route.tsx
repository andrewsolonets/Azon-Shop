import { NextRequest, NextResponse } from "next/server";
import { addReview } from "~/app/actions";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = Object.fromEntries(formData);
  const { heading, message, rating, productId, username } = data;
  console.log(data);
  const review = await addReview({
    heading,
    message,
    rating: Number(rating),
    productId: Number(productId),
    username: username ? username : "",
  });
  // Add data to the database
  return NextResponse.json({ message: review });
}
