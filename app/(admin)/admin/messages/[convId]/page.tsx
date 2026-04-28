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
  const [scheduleError, setScheduleError] = useState("");

  // Schedule state
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  // Fetch conversation document
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
      } catch (err) {
        console.error(err);
        setError("Failed to load conversation.");
      }
    })();
  }, [convId, router]);

  // Subscribe to messages (real‑time)
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
        setError(null); // clear any previous error
      },
      (err) => {
        console.error("Snapshot error:", err);
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [convId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a reply
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
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

  // Schedule / Reschedule
  const handleSchedule = async () => {
    if (!scheduleDate) {
      setScheduleError("Please pick a date and time.");
      return;
    }

    const parsedDate = new Date(scheduleDate);
    if (isNaN(parsedDate.getTime())) {
      setScheduleError("Invalid date. Please select a valid appointment time.");
      return;
    }

    try {
      await updateDoc(doc(db, "conversations", convId), {
        status: "scheduled",
        scheduledTime: Timestamp.fromDate(parsedDate),
        updatedAt: serverTimestamp(),
      });
      setShowSchedule(false);
      setScheduleError("");
    } catch (err) {
      console.error(err);
      setScheduleError("Failed to schedule. Check console for details.");
    }
  };

  // Finish conversation
  const handleFinish = async () => {
    if (
      !confirm(
        "Mark this conversation as finished? It will be removed from the list.",
      )
    )
      return;
    try {
      await updateDoc(doc(db, "conversations", convId), {
        status: "finished",
        updatedAt: serverTimestamp(),
      });
      router.push("/admin/messages");
    } catch (err) {
      console.error(err);
    }
  };

  // Loading or error states
  if (loading) {
    return (
      <div className="text-white text-center text-lg mt-20">
        Loading conversation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 mt-20">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#e98b33] text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[90vh]">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-4">
        <Link href="/admin/messages" className="text-[#e98b33] hover:underline">
          ← Back
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            {conversation?.status === "scheduled"
              ? "Reschedule"
              : "Schedule Appointment"}
          </button>
          <button
            onClick={handleFinish}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Finish
          </button>
        </div>
      </div>

      {/* ---------- PERSISTENT APPOINTMENT BANNER ---------- */}
      {conversation?.status === "scheduled" && conversation?.scheduledTime && (
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

      {/* Schedule date picker (conditionally visible) */}
      {showSchedule && (
        <div className="bg-white/10 p-4 rounded-xl mb-4">
          <p className="text-white mb-2">Set appointment date & time:</p>
          <div className="flex gap-3 items-start flex-wrap">
            <div>
              <label className="text-white/70 text-sm block mb-1">Date</label>
              <input
                type="date"
                value={scheduleDate ? scheduleDate.split("T")[0] : ""}
                onChange={(e) => {
                  const datePart = e.target.value;
                  const timePart = scheduleDate.split("T")[1] || "10:00";
                  setScheduleDate(`${datePart}T${timePart}`);
                  setScheduleError("");
                }}
                className="bg-white text-black px-3 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="text-white/70 text-sm block mb-1">Time</label>
              <input
                type="time"
                value={
                  scheduleDate
                    ? scheduleDate.split("T")[1]?.slice(0, 5)
                    : "10:00"
                }
                onChange={(e) => {
                  const timePart = e.target.value;
                  const datePart =
                    scheduleDate.split("T")[0] ||
                    new Date().toISOString().split("T")[0];
                  setScheduleDate(`${datePart}T${timePart}`);
                  setScheduleError("");
                }}
                className="bg-white text-black px-3 py-2 rounded-lg"
                required
              />
            </div>
          </div>
          <button
            onClick={handleSchedule}
            className="mt-3 bg-[#e98b33] text-white px-4 py-2 rounded-lg"
          >
            Confirm
          </button>
          {scheduleError && (
            <p className="text-red-300 text-sm mt-2">{scheduleError}</p>
          )}
        </div>
      )}

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto bg-white/5 rounded-xl p-4 space-y-4 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-xl ${
                msg.sender === "admin"
                  ? "bg-blue-500 text-white"
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

      {/* Message input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Reply..."
          className="flex-1 px-4 py-2 rounded-lg bg-white text-black"
        />
        <button
          type="submit"
          className="bg-[#e98b33] hover:bg-[#e4aa3f] text-white px-6 py-2 rounded-lg font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
}
