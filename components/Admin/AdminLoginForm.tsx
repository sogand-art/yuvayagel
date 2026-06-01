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
        setError("Admin değilsiniz.");
        await auth.signOut(); // log out the authenticated user
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message.includes("auth/")
            ? "Geçersiz e-posta veya şifre"
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
    <div className="brand-page-bg flex-1 flex flex-col justify-center items-center p-8 md:p-16">
      <Logo className="w-64 mb-8" height={140} width={140} />

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 rounded-2xl border border-white/12 bg-white/[0.075] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#a71d18]">
            Personel erişimi
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Yönetici Girişi
          </h1>
        </div>
        <div>
          <label className="block text-sm font-bold text-white/70">
            E-posta *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/16 bg-white/[0.08] px-4 py-2 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white/70">
            Şifre *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/16 bg-white/[0.08] px-4 py-2 text-white"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-[#a71d18] cursor-pointer hover:bg-[#861713] text-white py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? "Giriş yapılıyor..." : "Yönetici Girişi"}
        </button>
      </form>
    </div>
  );
}
