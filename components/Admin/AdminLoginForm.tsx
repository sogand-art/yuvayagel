// components/admin/AdminLoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AdminLoginForm() {
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
      // 1. Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // 2. Check admin role in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().role === "admin") {
        router.push("/admin"); // success – go to dashboard
      } else {
        setError("You are not an admin.");
        await auth.signOut(); // log out the authenticated user
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message.includes("auth/")
            ? "Invalid email or password"
            : err.message,
        );
      } else {
        setError("Login failed");
      }
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
            required
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
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-[#e98b33] cursor-pointer hover:bg-[#e4aa3f] text-white py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Admin Login"}
        </button>
      </form>
    </div>
  );
}
