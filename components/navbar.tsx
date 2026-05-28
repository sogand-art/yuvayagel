"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ uid: string; name: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
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
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav
      className={`${isHome ? "fixed" : "sticky"} top-0 z-50 transition-all duration-300`}
      style={{
        background: isHome
          ? scrolled
            ? "rgba(16,14,35,0.78)"
            : "linear-gradient(180deg,rgba(16,14,35,0.72),rgba(16,14,35,0))"
          : "rgba(16,14,35,0.82)",
        backdropFilter: isHome && !scrolled ? "none" : "blur(18px)",
        WebkitBackdropFilter: isHome && !scrolled ? "none" : "blur(18px)",
        borderBottom:
          isHome && !scrolled
            ? "1px solid transparent"
            : "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          isHome && !scrolled
            ? "none"
            : "0 14px 34px rgba(10,8,26,0.18)",
        left: isHome ? 0 : undefined,
        right: isHome ? 0 : undefined,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex items-center -space-x-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#a71d18]/70 bg-white p-0.5 shadow-md transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Z Piekla Do Domu"
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#37357f]/70 bg-white p-0.5 shadow-md transition-transform group-hover:scale-105">
              <Image
                src="/logo2.png"
                alt="Leben in Not e.V."
                width={36}
                height={36}
                className="h-full w-full object-contain"
              />
            </span>
          </span>
          <span className="hidden sm:block leading-tight">
            <span className="block text-base font-black uppercase tracking-wider text-white">
              Yuvaya Gel
            </span>
            <span className="block text-[10px] font-semibold tracking-widest text-white/40 uppercase">
              Partner Adoption Network
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { href: "/", label: "Home" },
            { href: "/pets", label: "Pets" },
            { href: "/pets?species=dog", label: "Dogs" },
            { href: "/pets?species=cat", label: "Cats" },
            { href: "/liked", label: "Liked" },
            { href: "/my-messages", label: "Messages" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="px-3 py-1.5 rounded-full text-[13px] font-semibold text-white/60 transition-all hover:bg-white/10 hover:text-white"
            >
              {label}
            </Link>
          ))}

          {/* Auth */}
          <div className="flex items-center gap-3 ml-3 pl-3 border-l border-white/10">
            {user ? (
              <>
                <span className="text-[13px] text-white/50">
                  <span className="text-white/80 font-semibold">
                    {user.name}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[13px] text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-[#a71d18] px-5 py-1.5 text-[13px] font-bold text-white shadow-lg shadow-[#a71d18]/30 hover:bg-[#c0221c] transition-all"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:bg-white/10"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 4h12M2 8h12M2 12h12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-6 pb-5 pt-1 flex flex-col gap-1"
          style={{
            background: "rgba(14,12,34,0.96)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/pets", label: "Pets" },
            { href: "/pets?species=dog", label: "Dogs" },
            { href: "/pets?species=cat", label: "Cats" },
            { href: "/liked", label: "Liked" },
            { href: "/my-messages", label: "Messages" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="py-2.5 text-[15px] font-semibold text-white/60 hover:text-white border-b border-white/5 transition-colors"
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 mt-1">
            {user ? (
              <div className="flex flex-col gap-2">
                <span className="text-sm text-white/50">
                  Welcome,{" "}
                  <span className="text-white/80 font-semibold">
                    {user.name}
                  </span>
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-sm text-white/40 underline"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="inline-block rounded-full bg-[#a71d18] px-6 py-2 text-sm font-bold text-white"
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
