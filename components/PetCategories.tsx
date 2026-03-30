import Image from "next/image";
import Link from "next/link";

export default function PetCategories() {
  return (
    <section className="w-full py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dogs"
          className="group relative h-75 overflow-hidden rounded-2xl"
        >
          <Image
            src="/dogs.jpg"
            alt="Dogs"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-3xl font-bold">Dogs</h2>
          </div>
        </Link>

        <Link
          href="/cats"
          className="group relative h-75 overflow-hidden rounded-2xl"
        >
          <Image
            src="/cats.png"
            alt="Cats"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-white text-2xl md:text-3xl font-bold">Cats</h2>
          </div>
        </Link>
      </div>
    </section>
  );
}
