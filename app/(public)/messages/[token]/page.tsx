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

    const isFinished = conversation?.status === "finished";

    if (isFinished) return;

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
      <div className="brand-page-bg min-h-screen flex items-center justify-center">
        <p className="text-[#37357f] text-xl font-semibold">
          Loading conversation...
        </p>
      </div>
    );
  }

  return (
    <div className="brand-page-bg min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col h-[90vh]">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/my-messages"
            className="text-[#a71d18] hover:underline font-bold"
          >
            ← My Messages
          </Link>
          <h1 className="text-2xl font-bold text-[#171717]">
            Chat about {conversation?.petName || "Pet"}
          </h1>
        </div>
        {conversation?.conversationType === "adoption" && (
          <div className="rounded-2xl border-4 border-[#37357f]/15 bg-white p-4 mb-4 shadow-md">
            <div className="flex gap-4 items-center">
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-[#37357f] flex items-center justify-center">
                {conversation?.petImage ? (
                  <img
                    src={conversation.petImage}
                    alt={conversation.petName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white/70 font-bold">Paw</span>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#171717]">
                  {conversation?.petName}
                </h2>

                <p className="text-[#171717]/70">{conversation?.petBreed}</p>

                <p className="text-[#37357f]/70 text-sm capitalize">
                  {conversation?.petSpecies}
                </p>

                <p className="text-[#37357f]/70 text-sm">
                  {Math.floor((conversation?.petAge || 0) / 12)} years{" "}
                  {(conversation?.petAge || 0) % 12} months
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Appointment Banner */}
        {conversation?.status === "finished" && (
          <div className="bg-[#a71d18] text-white px-4 py-3 rounded-xl mb-4">
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
                  {conversation.scheduledTime.toDate().toLocaleString()}
                </strong>
              </span>
            </div>
          )}

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto rounded-2xl border-2 border-[#37357f]/15 bg-white/80 p-4 space-y-4 mb-4">
          {conversation?.scheduledTime && messages.length > 0 && (
            <div className="flex justify-center">
              <div className="bg-[#37357f]/10 text-[#37357f] text-sm px-4 py-2 rounded-full">
                📅 Meeting scheduled for{" "}
                {conversation.scheduledTime.toDate().toLocaleString()}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-xl ${
                  msg.sender === "user"
                    ? "bg-[#4f8f11] text-white"
                    : "bg-[#37357f] text-white"
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
          <div className="bg-[#a71d18] text-white rounded-xl p-4 text-center">
            This conversation has been closed.
          </div>
        ) : (
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg bg-white text-black"
            />
            <button
              type="submit"
              className="bg-[#4f8f11] hover:bg-[#3a6b0d] text-white px-6 py-2 rounded-lg font-bold"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
