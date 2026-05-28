import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[760px] overflow-hidden text-white md:min-h-[calc(100vh+24px)]">
      <div className="relative mx-auto grid min-h-[760px] w-full max-w-7xl grid-cols-1 items-center gap-6 px-6 pb-20 pt-32 md:min-h-[calc(100vh+24px)] md:grid-cols-[0.92fr_1.08fr] md:pb-24 md:pt-24 lg:px-10">
        <div className="z-20 max-w-2xl">
          <h1 className="max-w-3xl text-[clamp(3.2rem,8vw,6.7rem)] font-black leading-[0.9] tracking-normal text-white">
            Every pet deserves a <span className="text-[#4f8f11]">home.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base font-medium leading-8 text-white/60 md:text-lg">
            Yuvaya Gel brings shelter cats and dogs into one calm adoption
            space. Browse real profiles, save your favorites, ask questions, and
            continue the adoption journey with the shelter team.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/pets"
              className="inline-flex items-center justify-center rounded-full bg-[#4f8f11] px-8 py-3 text-sm font-extrabold text-white shadow-[0_18px_42px_rgba(167,29,24,0.32)] transition hover:bg-[#355e0c]"
            >
              Meet Our Pets
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.07] px-8 py-3 text-sm font-extrabold text-white/75 backdrop-blur-md transition hover:bg-white/[0.12] hover:text-white"
            >
              How It Works
            </Link>
          </div>
        </div>

        <div className="relative z-10 min-h-[420px] md:min-h-[680px]">
          <div className="absolute bottom-[-10px] right-[-1%] h-[44%] w-[92%] rounded-t-full bg-gradient-to-t from-[#fff4c7]/12 via-[#fff4c7]/5 to-transparent blur-sm" />

          <div className="absolute bottom-[8px] right-[-8%] h-[94%] w-[70%] md:right-[-3%]">
            <Image
              src="/dog-hero.png"
              alt="Dog ready for adoption"
              fill
              sizes="(min-width: 768px) 48vw, 78vw"
              className="object-contain object-bottom drop-shadow-[0_32px_42px_rgba(0,0,0,0.38)]"
              priority
            />
          </div>

          <div className="absolute bottom-[8px] left-[2%] h-[68%] w-[62%] md:left-[-3%]">
            <Image
              src="/cat-hero.png"
              alt="Cat ready for adoption"
              fill
              sizes="(min-width: 768px) 42vw, 72vw"
              className="object-contain object-bottom drop-shadow-[0_30px_38px_rgba(0,0,0,0.34)]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
