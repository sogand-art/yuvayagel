/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "../logo";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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
      router.push("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const email = user.email;
      if (!email) throw new Error("Google account missing email");

      const fullName = user.displayName?.split(" ") ?? [];
      const firstName = fullName.length > 0 ? fullName[0] : "";
      const lastName = fullName.length > 1 ? fullName.slice(1).join(" ") : "";

      const userRef = doc(db, "Users", email);

      await setDoc(
        userRef,
        {
          email: email,
          ad: firstName,
          soyad: lastName,
          provider: "google",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Google Sign-In Failed");
    } finally {
      setLoading(false);
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
          disabled={loading}
          className="w-full mt-4 bg-[#e98b33] cursor-pointer hover:bg-[#e4aa3f] text-white py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="my-5 flex items-center w-full">
          <div className="grow border-t border-white opacity-30"></div>
          <span className="mx-4 text-white font-semibold">OR</span>
          <div className="grow border-t border-white opacity-30"></div>
        </div>
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
