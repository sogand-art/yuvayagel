/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(admin)/admin/messages/[convId]/page.tsx
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
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import Link from "next/link";

type Message = {
  id: string;
  sender: "user" | "admin";
  text: string;
  createdAt: Timestamp;
};

export default function AdminChatPage() {
  const { convId } = useParams<{ convId: string }>();
  const router = useRouter();

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const [showSchedule, setShowSchedule] = useState(false);

  const isFinished = conversation?.status === "finished";

  // Fetch conversation
  useEffect(() => {
    if (!convId) return;

    (async () => {
      try {
        const snap = await getDoc(doc(db, "conversations", convId));
        if (!snap.exists()) {
          router.replace("/admin/messages");
          return;
        }
        setConversation({ id: snap.id, ...snap.data() });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load conversation.");
      }
    })();
  }, [convId, router]);

  // Messages listener
  useEffect(() => {
    if (!convId) return;

    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", convId),
      orderBy("createdAt", "asc"),
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const msgs: Message[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Message[];

        setMessages(msgs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [convId]);

  // Adopt handler
  const handleAdopted = async () => {
    if (!conversation || isFinished) return;

    const confirmAdoption = confirm(`Mark ${conversation.petName} as adopted?`);
    if (!confirmAdoption) return;

    try {
      await addDoc(collection(db, "adoptedPets"), {
        petId: conversation.petId,
        petName: conversation.petName,
        petImage: conversation.petImage || "",
        petBreed: conversation.petBreed || "",
        petSpecies: conversation.petSpecies || "",
        adopterName: conversation.userName,
        adopterEmail: conversation.userEmail,
        adopterId: conversation.userId,
        conversationId: convId,
        adoptedAt: serverTimestamp(),
      });

      if (conversation.petId) {
        await updateDoc(doc(db, "pets", conversation.petId), {
          availability: "adopted",
        });
      }

      await updateDoc(doc(db, "conversations", convId), {
        status: "finished",
        updatedAt: serverTimestamp(),
      });

      setConversation((prev: any) => ({
        ...prev,
        status: "finished",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFinished || !newMsg.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        conversationId: convId,
        sender: "admin",
        text: newMsg.trim(),
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "conversations", convId), {
        updatedAt: serverTimestamp(),
      });

      setNewMsg("");
    } catch (err) {
      console.error(err);
    }
  };

  // Finish chat (NO redirect)
  const handleFinish = async () => {
    if (!confirm("Mark this conversation as finished?")) return;

    try {
      await updateDoc(doc(db, "conversations", convId), {
        status: "finished",
        updatedAt: serverTimestamp(),
      });

      setConversation((prev: any) => ({
        ...prev,
        status: "finished",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center mt-20">{error}</div>;
  }

  return (
    <div className="flex flex-col h-[90vh]">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-4">
        <Link href="/admin/messages" className="text-[#e98b33]">
          ← Back
        </Link>

        <div className="flex gap-2">
          {/* ALWAYS visible adopt button */}
          <button
            onClick={handleAdopted}
            disabled={isFinished}
            className={`px-4 py-2 rounded-lg text-sm text-white
              ${isFinished ? "bg-gray-600" : "bg-green-600 hover:bg-green-700"}
            `}
          >
            Mark Adopted
          </button>

          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="bg-yellow-500 px-4 py-2 rounded-lg text-sm text-white"
          >
            Schedule
          </button>

          <button
            onClick={handleFinish}
            className="bg-red-500 px-4 py-2 rounded-lg text-sm text-white"
          >
            Finish
          </button>
        </div>
      </div>

      {/* PET CARD */}
      {conversation?.conversationType === "adoption" && (
        <div className="bg-white/10 p-4 rounded-xl mb-4 text-white">
          <h2 className="text-xl font-bold">{conversation.petName}</h2>
          <p>{conversation.petBreed}</p>
        </div>
      )}

      {/* FINISHED BANNER */}
      {isFinished && (
        <div className="bg-red-600 text-white p-3 rounded-xl mb-4">
          This conversation is finished (read-only history).
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto bg-white/5 p-4 rounded-xl space-y-3 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
          >
            <div className="px-4 py-2 rounded-xl bg-white/20 text-white">
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      {isFinished ? (
        <div className="text-center text-red-200 bg-red-500/20 p-3 rounded-xl">
          Chat is closed. You can only view history.
        </div>
      ) : (
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg"
            placeholder="Reply..."
          />
          <button className="bg-[#e98b33] px-6 py-2 rounded-lg text-white">
            Send
          </button>
        </form>
      )}
    </div>
  );
}
