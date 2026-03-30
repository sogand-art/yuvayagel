"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-secondaryOrange text-black px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </Link>

        <div className="hidden md:flex gap-6">
          <Link className="hover:underline" href="/">
            Home
          </Link>
          <Link className="hover:underline" href="/about">
            About
          </Link>
          <Link className="hover:underline" href="/services">
            Services
          </Link>
          <Link className="hover:underline" href="/contact">
            Contact
          </Link>
        </div>

        <button
          className="md:hidden cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-4 mt-4 md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link href="/services" onClick={() => setMenuOpen(false)}>
            Services
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
