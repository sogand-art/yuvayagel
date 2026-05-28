import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden text-white">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-10 pt-14 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:pb-12 md:pt-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-4">
            <span className="flex items-center -space-x-4">
              <span className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white p-2 shadow-[0_18px_42px_rgba(0,0,0,0.24)]">
                <Image
                  src="/logo.png"
                  alt="Z Piekla Do Domu partner logo"
                  fill
                  className="object-contain p-2"
                />
              </span>
              <span className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white p-2 shadow-[0_18px_42px_rgba(0,0,0,0.24)]">
                <Image
                  src="/logo2.png"
                  alt="Leben in Not e.V. partner logo"
                  fill
                  className="object-contain p-2"
                />
              </span>
            </span>
            <span>
              <span className="block text-lg font-black uppercase tracking-wide">
                Yuvaya Gel
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/38">
                Partner Adoption Network
              </span>
            </span>
          </Link>

          <p className="mt-6 max-w-sm text-sm font-medium leading-7 text-white/48">
            A shared adoption platform for shelter pets, adopter conversations,
            and the small practical steps that lead animals home.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#79c617]">
            Explore
          </h3>
          <ul className="mt-4 space-y-3 text-sm font-semibold text-white/58">
            <li>
              <Link className="transition hover:text-white" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-white" href="/pets">
                All Pets
              </Link>
            </li>
            <li>
              <Link
                className="transition hover:text-white"
                href="/pets?species=dog"
              >
                Dogs
              </Link>
            </li>
            <li>
              <Link
                className="transition hover:text-white"
                href="/pets?species=cat"
              >
                Cats
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.18em] text-[#79c617]">
            Contact
          </h3>
          <div className="mt-4 space-y-3 text-sm font-semibold text-white/58">
            <p>info@yuvayagel.com</p>
            <p>+90 555 123 4567</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Instagram", "Facebook", "Twitter"].map((item) => (
              <a
                key={item}
                href="#"
                className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-xs font-bold text-white/58 transition hover:bg-white/10 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-7">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <p className="pt-6 text-center text-xs font-semibold text-white/34">
          © {new Date().getFullYear()} Yuvaya Gel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
