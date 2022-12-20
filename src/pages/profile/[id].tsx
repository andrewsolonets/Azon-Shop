import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const UserProfile = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { data } = trpc.auth.getUser.useQuery();

  if (!sessionData?.user?.id)
    return (
      <section className="mt-32 h-screen py-4 px-8">
        <div>Unauthorized</div>
      </section>
    );
  if (!router.query) return;
  return (
    <section className="mt-32 py-4 px-8">
      <div className="flex flex-col gap-6">
        <h3 className="text-3xl font-semibold">Orders</h3>
        <table className="w-full  table-auto border-separate border-spacing-y-2  text-left">
          <thead>
            <tr className="[&>*]:p-4">
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="">
            {data?.orders.map((el) => (
              <tr className="rounded-xl bg-violet-800 [&>*]:p-4" key={el.id}>
                <td>{el.createdAt.toDateString()}</td>
                <td>${el.totalAmount}</td>
                <td>{el.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-72 w-full "></div>
      </div>
    </section>
  );
};

export default UserProfile;
