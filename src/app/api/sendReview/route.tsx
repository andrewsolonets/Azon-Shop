import { NextRequest, NextResponse } from "next/server";
import { addReview } from "~/app/actions";
import { schema } from "~/app/reviewSchema";

// TODO: Validate data here
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const data = Object.fromEntries(formData); // Convert form data into a simple data object

  const parsed = schema.safeParse(data);
  if (parsed.success) {
    const { heading, message, rating, productId, username } = parsed.data;
    console.log(parsed);

    const review = await addReview({
      heading,
      message,
      rating: Number(rating),
      productId: Number(productId),
      username: username ? username : "",
    });
    // Add data to the database
    return NextResponse.json({ message: review });
  } else {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
}
