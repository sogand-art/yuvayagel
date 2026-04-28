// components/footer.tsx
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <Image src="/logo.png" alt="Logo" width={150} height={150} />
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
          <ul className="space-y-2 text-white/80">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/dogs">Dogs</Link>
            </li>
            <li>
              <Link href="/cats">Cats</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Contact</h3>
          <p className="text-white/80">info@yuvayagel.com</p>
          <p className="text-white/80 mt-1">+90 555 123 4567</p>

          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-[#e98b33] transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-[#e98b33] transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-[#e98b33] transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 text-center py-4 text-sm text-white/50">
        © {new Date().getFullYear()} Yuvaya Gel. All rights reserved.
      </div>
    </footer>
  );
}
