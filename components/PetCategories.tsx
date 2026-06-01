import Link from "next/link";
import Image from "next/image";

export default function PetCategories() {
  const categories = [
    {
      href: "/pets?species=dog",
      label: "Köpekler",
      text: "Yeni bir başlangıç bekleyen sadık dostlar.",
      image: "/dog-hero.png",
      border: "border-[#79c617]/24",
      glow: "from-[#79c617]/22",
    },
    {
      href: "/pets?species=cat",
      label: "Kediler",
      text: "Meraklı, sakin, oyuncu ve yuvaya hazır.",
      image: "/cat-hero.png",
      border: "border-[#a71d18]/28",
      glow: "from-[#a71d18]/26",
    },
  ];

  return (
    <section
      id="pets"
      className="relative overflow-hidden px-6 py-16 text-white md:py-20"
    >
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#79c617]">
              Bir yol seç
            </p>
            <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">
              Yol Arkadaşını Bul
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className={`group relative min-h-72 overflow-hidden rounded-[2rem] border ${category.border} bg-white/[0.055] p-7 shadow-[0_26px_60px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/[0.075] md:min-h-80`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.glow} via-transparent to-transparent opacity-80`}
              />
              <div className="absolute bottom-0 right-0 h-[92%] w-[62%] transition duration-500 group-hover:scale-[1.04]">
                <Image
                  src={category.image}
                  alt={`${category.label} available for adoption`}
                  fill
                  sizes="(min-width: 768px) 35vw, 72vw"
                  className="object-contain object-bottom drop-shadow-[0_26px_36px_rgba(0,0,0,0.32)]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#100e23] to-transparent" />

              <div className="relative z-10 flex h-full max-w-[55%] flex-col justify-end">
                <p className="text-5xl font-black text-white md:text-6xl">
                  {category.label}
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/50">
                  {category.text}
                </p>
                <span className="mt-6 inline-flex w-fit rounded-full border border-white/15 bg-white/[0.07] px-5 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-white/70 transition-all duration-300 group-hover:bg-white/15 group-hover:text-white group-hover:scale-105 group-hover:border-white/30 cursor-pointer">
                  Göz At
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
