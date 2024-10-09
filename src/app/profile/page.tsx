import { SignedIn, SignOutButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { useParams } from "next/navigation";
import UserOrders from "~/components/UserOrders";
import { db } from "~/server/db";

export default async function CustomerProfile() {
  const user = await currentUser();
  const userId = user?.id;
  if (!userId)
    return (
      <section className="mt-32 h-screen px-8 py-4">
        <div>Unauthorized</div>
      </section>
    );
  if (!userId) return;
  const orders = await db.query.orders.findMany({
    where: (orders, { eq }) => eq(orders.userId, userId),
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
  });

  return (
    <>
      <section className="flex flex-col gap-3 px-8 py-4">
        <div className="flex w-full gap-12">
          <h1 className="text-2xl">Welcome, {user.firstName}!</h1>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedIn>
            <SignOutButton />
          </SignedIn>
        </div>
        {orders?.length ? (
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">Orders</h3>
            <UserOrders orders={orders} />
            <div className="h-72 w-full"></div>
          </div>
        ) : (
          <p>Your orders will show up here. Start shopping...</p>
        )}
      </section>
    </>
  );
}
