import Image from "next/image";
import Link from "next/link";

export const CategoryItem = ({ id, name }: { id: string; name: string }) => {
  return (
    <div className="group relative h-64 w-full overflow-hidden object-cover">
      <Link href={`/categories/${id}`}>
        <div className="absolute z-10 h-full w-full  bg-violet-700 object-cover opacity-50 bg-blend-overlay transition duration-500 group-hover:bg-opacity-0 "></div>
        <Image
          alt={name}
          // changed image to static for data saving

          src={"/static/img/testcardimg.png"}
          // src={`https://loremflickr.com/640/480/abstract?random=${Math.round(
          //   Math.random() * 1000
          // )}`}
          className="scale-100 object-cover transition duration-500 group-hover:scale-110"
          fill
          sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
        />
        <h4 className="absolute top-1/2 left-1/2 z-[12] -translate-y-1/2 -translate-x-1/2 text-center text-2xl font-semibold ">
          {name}
        </h4>
      </Link>
    </div>
  );
};
