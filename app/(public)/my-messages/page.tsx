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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) router.replace("/login?redirect=/my-messages");
      else setUser(u);
    });
    return () => unsub();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "conversations"),
      where("userId", "==", user.uid),
      orderBy("updatedAt", "desc"),
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Conversation[];
      setConvs(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  if (loading)
    return (
      <div className="brand-page-bg min-h-screen flex items-center justify-center">
        <p className="text-[#37357f] font-semibold">Loading...</p>
      </div>
    );

  return (
    <div className="brand-page-bg min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-[#171717] mb-8">
          My Messages
        </h1>
        {convs.length === 0 ? (
          <p className="text-[#37357f]/70">No conversations yet.</p>
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
                  {conv.status}
                </p>
                <p className="text-[#171717]/50 text-xs">
                  Last updated: {conv.updatedAt.toDate().toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
