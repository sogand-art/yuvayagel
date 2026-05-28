/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Logo from "../logo";
import Image from "next/image";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { setDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const passwordChecks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
  };

  const isValidPassword = passwordChecks.length && passwordChecks.uppercase;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !repeatPassword) {
      setError("Fill all required fields");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isValidPassword) {
      setError(
        "Password must be at least 6 characters and include one uppercase letter",
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        familyName,
        email,
      });

      console.log("Signup success");
    } catch (err: any) {
      setError(err.message);
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
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-white/12 bg-white/[0.075] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#79c617]">
            Create your adopter profile
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-white">Sign Up</h1>
        </div>
        <div>
          <label className="block text-sm font-bold text-white/70">
            Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-white/16 bg-white/[0.08] px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white/70">
            Family Name
          </label>
          <input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/16 bg-white/[0.08] px-4 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white/70">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-white/16 bg-white/[0.08] px-4 py-2 text-white"
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
            minLength={6}
            pattern="(?=.*[A-Z]).{6,}"
            title="Use at least 6 characters and one uppercase letter"
            required
            className="mt-1 w-full rounded-lg border border-white/16 bg-white/[0.08] px-4 py-2 text-white"
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-sm text-white/70">
          <p className="font-bold text-white">Password requirements</p>
          <p
            className={
              passwordChecks.length ? "text-[#4f8f11]" : "text-[#a71d18]"
            }
          >
            At least 6 characters
          </p>
          <p
            className={
              passwordChecks.uppercase ? "text-[#4f8f11]" : "text-[#a71d18]"
            }
          >
            At least one uppercase letter
          </p>
        </div>

        <div>
          <label className="block text-sm font-bold text-white/70">
            Confirm Password *
          </label>
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-white/16 bg-white/[0.08] px-4 py-2 text-white"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

        <button
          type="submit"
          className="w-full mt-4 bg-[#a71d18] hover:bg-[#861713] text-white py-3 rounded-lg font-bold"
        >
          Sign Up
        </button>
        {/* <div className="my-5 flex items-center w-full">
          <div className="grow border-t border-white/12"></div>
          <span className="mx-4 text-white/45 font-semibold">OR</span>
          <div className="grow border-t border-white/12"></div>
        </div> */}
      </form>

      <p className="mt-6 text-lg text-white/72">
        Already a member?{" "}
        <a href="/login" className="text-white font-bold hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
