// app/(admin)/admin/messages/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

type Conversation = {
  id: string;
  petName: string;
  userName: string;
  userEmail: string;
  status: "active" | "scheduled" | "finished";
  scheduledTime?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessage?: string; // we'll compute later
};

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc"),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs
        .filter((doc) => doc.data().status !== "finished") // hide finished
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Conversation[];
      setConversations(convs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <p className="text-white text-center">Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Messages</h1>
      {conversations.length === 0 ? (
        <p className="text-white/70">No active conversations.</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/admin/messages/${conv.id}`}
              className="block bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 hover:bg-white/20 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {conv.petName} —{" "}
                    <span className="text-sm font-normal">{conv.userName}</span>
                  </h2>
                  <p className="text-white/60 text-sm">{conv.userEmail}</p>
                  <p className="text-white/80 text-sm mt-1">
                    Status:{" "}
                    <span
                      className={`capitalize ${conv.status === "scheduled" ? "text-yellow-300" : "text-green-300"}`}
                    >
                      {conv.status}
                    </span>
                  </p>
                  {conv.scheduledTime && (
                    <p className="text-white/60 text-xs">
                      Appointment:{" "}
                      {conv.scheduledTime.toDate().toLocaleString()}
                    </p>
                  )}
                </div>
                <span className="text-xs text-white/50">
                  {conv.createdAt?.toDate().toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
