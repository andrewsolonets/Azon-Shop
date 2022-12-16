import { useRouter } from "next/router";

const UserProfile = () => {
  const router = useRouter();
  if (!router.query) return;
  const { id } = router.query;
  return (
    <section className="mt-32 py-4 px-8">
      <p>{id}</p>
    </section>
  );
};

export default UserProfile;
