import { SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { useParams } from "next/navigation";
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
  });

  return (
    <>
      <section className="mt-32 flex flex-col gap-3 px-8 py-4">
        <div className="flex w-full gap-12">
          <h1 className="text-2xl">Welcome, {user.firstName}!</h1>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
        {orders?.length ? (
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-semibold">Orders</h3>
            <table className="w-full table-auto border-separate border-spacing-y-2 text-left">
              <thead>
                <tr className="[&>*]:p-4">
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="">
                {orders?.map((el) => (
                  <tr
                    className="rounded-xl bg-violet-800 [&>*]:p-4"
                    key={el.id}
                  >
                    <td>{el.createdAt.toDateString()}</td>
                    <td>${el.totalAmount}</td>
                    <td>{el.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="h-72 w-full"></div>
          </div>
        ) : (
          <p>Your orders will show up here. Start shopping...</p>
        )}
      </section>
    </>
  );
}
