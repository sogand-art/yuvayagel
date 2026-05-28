/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Logo from "@/components/logo";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Enter your email");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, cleanEmail);

      setMessage("If this email exists, a reset link has been sent.");
      setEmail("");
    } catch (err: any) {
      // Firebase-safe error handling
      const code = err?.code;

      if (code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (code === "auth/invalid-email") {
        setError("Invalid email");
      } else {
        setError("Failed to send reset email. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brand-page-bg min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <Logo className="w-64 mb-8" height={140} width={140} />

      <h1 className="text-3xl font-bold text-white mb-2">
        Forgot Your Password?
      </h1>

      <p className="text-white/68 text-center max-w-md mb-6">
        Enter your email and we’ll send you a reset link.
      </p>

      <form
        onSubmit={handleReset}
        className="w-full max-w-md space-y-4 rounded-2xl border border-white/12 bg-white/[0.075] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <div>
          <label className="block text-sm font-bold text-white/70">
            Email *
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/16 bg-white/[0.08] px-4 py-2 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-[#a71d18] hover:bg-[#861713] text-white py-3 rounded-lg font-bold disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center">
          <Link
            href="/login"
            className="text-white/72 font-bold hover:text-white hover:underline"
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
