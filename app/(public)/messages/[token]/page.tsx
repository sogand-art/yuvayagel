/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(public)/messages/[token]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";

type Message = {
  id: string;
  sender: "user" | "admin";
  text: string;
  createdAt: Timestamp;
};

export default function UserChatPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch conversation details
  useEffect(() => {
    if (!token) return;
    (async () => {
      const snap = await getDoc(doc(db, "conversations", token));
      if (!snap.exists()) {
        router.replace("/pets");
        return;
      }
      setConversation({ id: snap.id, ...snap.data() });
      setLoading(false);
    })();
  }, [token, router]);

  // Subscribe to messages
  useEffect(() => {
    if (!token) return;
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", token),
      orderBy("createdAt", "asc"),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Message[];
      setMessages(msgs);
    });
    return () => unsub();
  }, [token]);

  // Auto‑scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (conversation?.status === "finished") return;

    if (!newMsg.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        conversationId: token,
        sender: "user",
        text: newMsg.trim(),
        createdAt: serverTimestamp(),
      });

      setNewMsg("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading conversation…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-900 py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col h-[90vh]">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/my-messages" className="text-[#e98b33] hover:underline">
            ← My Messages
          </Link>
          <h1 className="text-2xl font-bold text-white">
            Chat about {conversation?.petName || "Pet"}
          </h1>
        </div>
        {conversation?.conversationType === "adoption" && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 mb-4">
            <div className="flex gap-4 items-center">
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center">
                {conversation?.petImage ? (
                  <img
                    src={conversation.petImage}
                    alt={conversation.petName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-white/50">🐾</span>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {conversation?.petName}
                </h2>

                <p className="text-white/70">{conversation?.petBreed}</p>

                <p className="text-white/60 text-sm capitalize">
                  {conversation?.petSpecies}
                </p>

                <p className="text-white/60 text-sm">
                  {Math.floor((conversation?.petAge || 0) / 12)} years{" "}
                  {(conversation?.petAge || 0) % 12} months
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Appointment Banner */}
        {conversation?.status === "finished" && (
          <div className="bg-red-600 text-white px-4 py-3 rounded-xl mb-4">
            🔒 This conversation has been closed.
          </div>
        )}
        {conversation?.status === "scheduled" &&
          conversation?.scheduledTime && (
            <div className="bg-green-700 text-white px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              <span>📅</span>
              <span>
                Appointment scheduled for{" "}
                <strong>
                  {new Date(
                    conversation.scheduledTime.seconds * 1000,
                  ).toLocaleString()}
                </strong>
              </span>
            </div>
          )}

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto bg-white/5 rounded-xl p-4 space-y-4 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl ${
                  msg.sender === "user"
                    ? "bg-[#e98b33] text-white"
                    : "bg-white/20 text-white"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-white/50 mt-1">
                  {msg.createdAt?.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {conversation?.status === "finished" ? (
          <div className="bg-red-500/20 border border-red-400/30 text-red-200 rounded-xl p-4 text-center">
            This conversation has been closed.
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 px-4 py-2 rounded-lg bg-white text-black"
            />
            <button
              type="submit"
              className="bg-[#e98b33] hover:bg-[#e4aa3f] text-white px-6 py-2 rounded-lg font-semibold"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
