// components/PetCategories.tsx
import Link from "next/link";
import Image from "next/image";

export default function PetCategories() {
  return (
    <section id="pets" className="w-full py-16 px-6 bg-green-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Find Your Companion
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            href="/pets?species=dog"
            className="group relative h-80 md:h-96 overflow-hidden rounded-2xl"
          >
            <Image
              src="/dogs.jpg"
              alt="Dogs"
              fill
              className="object-cover ..."
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl md:text-4xl font-bold">
                Dogs
              </span>
            </div>
          </Link>

          <Link
            href="/pets?species=cat"
            className="group relative h-80 md:h-96 overflow-hidden rounded-2xl"
          >
            <Image
              src="/cats.png"
              alt="Cats"
              fill
              className="object-cover ..."
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-2xl md:text-4xl font-bold">
                Cats
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
