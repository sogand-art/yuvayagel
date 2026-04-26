"use client";

import { useState } from "react";
import Logo from "@/components/logo";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Invalid email");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessage("Reset link sent to your email");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-900 p-6">
      <Logo className="w-64 mb-8" height={140} width={140} />

      <h1 className="text-3xl font-bold text-white mb-2">
        {" "}
        Forgot Your Password?{" "}
      </h1>

      <p className="text-white/80 text-center max-w-md mb-6">
        Enter your email address and we’ll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleReset} className="w-full max-w-md space-y-4">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-[#e98b33] cursor-pointer hover:bg-[#e4aa3f] text-white py-3 rounded-lg font-bold disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-blue-500 font-bold hover:underline mt-2"
          >
            Login Now
          </Link>
        </div>
      </form>

      {message && (
        <p className="mt-4 text-green-400 text-center max-w-md">{message}</p>
      )}

      {error && (
        <p className="mt-4 text-red-400 text-center max-w-md font-bold">
          {error}
        </p>
      )}
    </div>
  );
}
