"use client";

import { useState } from "react";
import Logo from "../logo";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Fill all required fields");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login success");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 bg-green-900">
      <Logo className="w-64 mb-8" height={140} width={140} />

      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4">
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

          <a
            href="/forgot-password"
            className="inline-block text-blue-500 font-bold hover:underline mt-2"
          >
            Forgot password
          </a>
        </div>

        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

        <button
          type="submit"
          className="w-full mt-4 bg-[#e98b33] cursor-pointer hover:bg-[#e4aa3f] text-white py-3 rounded-lg font-bold"
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-lg text-white">
        Not a member?{" "}
        <a href="/signup" className="text-blue-500 font-bold hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
}