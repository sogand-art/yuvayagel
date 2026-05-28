"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../logo";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const redirect =
        new URLSearchParams(window.location.search).get("redirect") || "/";
      router.push(redirect);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brand-page-bg flex-1 flex flex-col justify-center items-center p-8 md:p-16">
      <div className="mb-5 flex items-center -space-x-3">
        <Link href="/" className="block">
          <span className="relative h-[140px] w-[140px] rounded-full border-4 border-[#fff4c7] bg-[#f3edd4] block">
            <Image
              src="/logo.png"
              alt="Z Piekla Do Domu partner logo"
              fill
              className="object-contain p-3"
              sizes="140px"
            />
          </span>
        </Link>

        <Link href="/" className="block">
          <span className="relative h-[140px] w-[140px] rounded-full border-4 border-[#79c617] bg-[#ffffff] block">
            <Image
              src="/logo2.png"
              alt="Leben in Not e.V. partner logo"
              fill
              className="object-contain p-3"
              sizes="140px"
            />
          </span>
        </Link>
      </div>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 rounded-2xl border border-white/12 bg-white/[0.075] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#79c617]">
            Welcome back
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-white">Login</h1>
        </div>
        <div>
          <label className="block text-sm font-bold text-white/70">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/16 bg-white/[0.08] px-4 py-2 text-white placeholder-white/45"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white/70">
            Password *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/16 bg-white/[0.08] px-4 py-2 text-white"
          />

          <a
            href="/forgot-password"
            className="inline-block text-white/68 font-bold hover:text-white hover:underline mt-2"
          >
            Forgot password
          </a>
        </div>

        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-[#a71d18] cursor-pointer hover:bg-[#861713] text-white py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* <div className="my-5 flex items-center w-full">
          <div className="grow border-t border-white/12"></div>
          <span className="mx-4 text-white/45 font-semibold">OR</span>
          <div className="grow border-t border-white/12"></div>
        </div> */}
      </form>

      <p className="mt-6 text-lg text-white/72">
        Not a member?{" "}
        <a href="/signup" className="text-white font-bold hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
}
