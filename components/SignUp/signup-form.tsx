/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Logo from "../logo";

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

  const onSubmit = (e: React.FormEvent) => {
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

    console.log({
      name,
      familyName,
      email,
      password,
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 bg-green-900">
      <Logo className="w-64 mb-8" height={140} width={140} />

      <form
        onSubmit={onSubmit}
        noValidate
        className="w-full max-w-md space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-white">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border-2 bg-white text-black px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Family Name
          </label>
          <input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="mt-1 w-full rounded-lg border-2 bg-white text-black px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border-2 bg-white text-black px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Password *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border-2 bg-white text-black px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white">
            Confirm Password *
          </label>
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border-2 bg-white text-black px-4 py-2"
          />
        </div>

        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

        <button
          type="submit"
          className="w-full mt-4 bg-[#e98b33] cursor-pointer hover:bg-[#e4aa3f] text-white py-3 rounded-lg font-bold"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-lg text-white">
        Already a member?{" "}
        <a href="/login" className=" text-blue-500 font-bold hover:underline">
          Login
        </a>
      </p>
    </div>
  );
}
