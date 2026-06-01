/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(public)/my-messages/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  FirestoreError,
} from "firebase/firestore";
import Link from "next/link";

type Conversation = {
  id: string;
  petName: string;
  status: string;
  updatedAt: Timestamp;
};

export default function MyMessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [convs, setConvs] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/login?redirect=/my-messages");
      else setUser(u);
    });
    return () => unsub();
  }, [router]);

  // Fetch conversations – try indexed query first, fall back to client filter
  useEffect(() => {
    if (!user) return;

    // Attempt indexed query
    const q = query(
      collection(db, "conversations"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Conversation[];
        setConvs(data);
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        console.warn(
          "Indexed query failed, falling back to client filter:",
          err.message,
        );

        // Fallback: get all conversations and filter by userId client-side
        const fallbackQ = query(
          collection(db, "conversations"),
          orderBy("updatedAt", "desc"),
        );
        const fallbackUnsub = onSnapshot(
          fallbackQ,
          (snap) => {
            const data = snap.docs
              .filter((d) => d.data().userId === user.uid)
              .map((d) => ({ id: d.id, ...d.data() })) as Conversation[];
            setConvs(data);
            setLoading(false);
            setError(null);
          },
          (fallbackErr) => {
            console.error(fallbackErr);
            setError(fallbackErr.message);
            setLoading(false);
          },
        );
        return fallbackUnsub; // replace listener with fallback
      },
    );

    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <div className="brand-page-bg min-h-screen flex items-center justify-center">
        <p className="text-[#37357f] font-semibold">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brand-page-bg min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#a71d18] text-white px-4 py-2 rounded-lg font-bold"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="brand-page-bg min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#171717] mb-8">
          Mesajlarım
        </h1>
        {convs.length === 0 ? (
          <p className="text-[#37357f]/70">Henüz konuşma yok.</p>
        ) : (
          <div className="space-y-4">
            {convs.map((conv) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className="block rounded-2xl border-2 border-[#37357f]/15 bg-white p-4 shadow-md transition hover:border-[#79c617]"
              >
                <p className="text-[#171717] font-semibold">{conv.petName}</p>
                <p className="text-[#37357f]/70 text-sm capitalize">
                  {conv.status === "active"
                    ? "Aktif"
                    : conv.status === "scheduled"
                      ? "Planlandı"
                      : conv.status === "finished"
                        ? "Tamamlandı"
                        : conv.status}
                </p>
                <p className="text-[#171717]/50 text-xs">
                  Son güncelleme: {conv.updatedAt.toDate().toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
