import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="text-amber-500">
        Return Home
      </Link>
    </div>
  );
}
