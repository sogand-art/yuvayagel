// components/navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{
    uid: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch the name from Firestore (use the same path as your signup)
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const name = userDoc.exists()
          ? userDoc.data().name || "Friend"
          : "Friend";
        setUser({ uid: firebaseUser.uid, name });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optionally redirect to home
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-green-900 text-white px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </Link>

        {/* Desktop links + auth */}
        <div className="hidden md:flex gap-6 items-center">
          <Link className="hover:text-[#e98b33] transition-colors" href="/">
            Home
          </Link>
          <Link className="hover:text-[#e98b33] transition-colors" href="/pets">
            Pets
          </Link>
          <Link
            className="hover:text-[#e98b33] transition-colors"
            href="/pets?species=dog"
          >
            Dogs
          </Link>
          <Link
            className="hover:text-[#e98b33] transition-colors"
            href="/pets?species=cat"
          >
            Cats
          </Link>
          <Link
            href="/my-messages"
            className="hover:text-[#e98b33] transition-colors"
          >
            My Messages
          </Link>
          <Link
            className="hover:text-[#e98b33] transition-colors"
            href="/about"
          >
            About
          </Link>
          <Link
            className="hover:text-[#e98b33] transition-colors"
            href="/contact"
          >
            Contact
          </Link>

          {/* Right side: login or user info */}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/30">
            {user ? (
              <>
                <span className="text-white/80">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-white/70 hover:text-white underline"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-[#e98b33] hover:bg-[#e4aa3f] text-white px-4 py-1.5 rounded-full font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 mt-4 pb-2">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/pets?species=dog" onClick={() => setMenuOpen(false)}>
            Dogs
          </Link>
          <Link href="/pets?species=cat" onClick={() => setMenuOpen(false)}>
            Cats
          </Link>
          <Link href="/my-messages" onClick={() => setMenuOpen(false)}>
            My Messages
          </Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          {/* Mobile auth section */}
          <div className="border-t border-white/20 pt-3 mt-2">
            {user ? (
              <div className="flex flex-col gap-1">
                <span className="text-white/80">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-white/70 underline"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="inline-block bg-[#e98b33] text-white px-4 py-1.5 rounded-full text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
