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
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const isFinished = conversation?.status === "finished";
  const today = new Date().toISOString().split("T")[0];
  const hasSchedule = !!conversation?.scheduledTime;

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
        setError("Konuşma yüklenemedi.");
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

    const confirmAdoption = confirm(
      ` ${conversation.petName} sahiplendirildi olarak işaretlensin mi?`,
    );
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
    return (
      <div className="text-[#37357f] text-center mt-20 font-semibold">
        Yükleniyor...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center mt-20">{error}</div>;
  }

  return (
    <div className="flex flex-col h-[90vh]">
      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-4">
        <Link href="/admin/messages" className="text-[#a71d18] font-bold">
          ← Geri
        </Link>

        <div className="flex gap-2">
          {/* ALWAYS visible adopt button */}
          <button
            onClick={handleAdopted}
            disabled={isFinished}
            className={`px-4 py-2 rounded-lg text-sm text-white
              ${isFinished ? "bg-gray-600" : "bg-[#4f8f11] hover:bg-[#3f740d] cursor-pointer"}
            `}
          >
            Sahiplendirildi Olarak İşaretle
          </button>

          <button
            disabled={hasSchedule}
            onClick={() => setShowSchedule(!showSchedule)}
            className={`px-4 py-2 rounded-lg text-sm text-white transition
    ${
      hasSchedule
        ? "bg-gray-500 cursor-not-allowed"
        : "bg-[#37357f] hover:bg-[#2a2860] cursor-pointer"
    }
  `}
          >
            Planla
          </button>

          <button
            onClick={handleFinish}
            className="bg-[#a71d18] hover:bg-[#861713] px-4 py-2 rounded-lg text-sm text-white cursor-pointer"
          >
            Tamamla
          </button>
        </div>
      </div>

      {conversation?.status === "scheduled" && conversation?.scheduledTime && (
        <div className="bg-green-700 text-white px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
          <span>📅</span>
          <span>
            Görüşme planlandı:
            <strong>
              {conversation.scheduledTime.toDate().toLocaleString()}
            </strong>
          </span>
        </div>
      )}

      {/* PET CARD */}
      {conversation?.conversationType === "adoption" && (
        <div className="rounded-2xl border-2 border-[#37357f]/15 bg-white p-4 mb-4 shadow-md">
          <h2 className="text-xl font-bold text-[#171717]">
            {conversation.petName}
          </h2>
          <p className="text-[#171717]/70">{conversation.petBreed}</p>
        </div>
      )}

      {/* SCHEDULE PANEL */}
      {showSchedule && (
        <div className="mb-4 rounded-2xl border border-[#37357f]/15 bg-white p-4 shadow-md space-y-4">
          <p className="font-bold text-[#37357f] text-lg">Görüşme Planla</p>

          {/* DATE PICKER */}
          <div>
            <label className="text-sm font-semibold text-[#37357f]/70">
              Tarih Seç
            </label>
            <input
              type="date"
              min={today}
              className="w-full mt-1 border rounded-lg px-3 py-2"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>

          {/* TIME SLOTS */}
          <div>
            <label className="text-sm font-semibold text-[#37357f]/70">
              Saat Seç
            </label>

            <select
              className="w-full mt-1 border rounded-lg px-3 py-2"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            >
              <option value="">Bir saat seç</option>
              <option value="09:00">09:00</option>
              <option value="11:00">11:00</option>
              <option value="13:00">13:00</option>
              <option value="15:00">15:00</option>
              <option value="17:00">17:00</option>
              <option value="19:00">19:00</option>
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowSchedule(false)}
              className="flex-1 bg-[#37357f] hover:bg-[#2a2860] text-white cursor-pointer px-4 py-2 rounded-lg font-semibold"
            >
              İptal
            </button>

            <button
              disabled={
                !scheduleDate || !scheduleTime || hasSchedule || isFinished
              }
              onClick={async () => {
                const combined = Timestamp.fromDate(
                  new Date(`${scheduleDate}T${scheduleTime}:00`),
                );

                await updateDoc(doc(db, "conversations", convId), {
                  scheduledTime: combined,
                  status: "scheduled",
                  updatedAt: serverTimestamp(),
                });

                setShowSchedule(false);
                setScheduleDate("");
                setScheduleTime("");
              }}
              className={`flex-1 px-4 py-2 rounded-lg font-bold text-white transition
    ${
      !scheduleDate || !scheduleTime
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#4f8f11] hover:bg-[#3f740d] cursor-pointer"
    }
  `}
            >
              Planı Onayla
            </button>
          </div>
        </div>
      )}

      {/* FINISHED BANNER */}
      {isFinished && (
        <div className="bg-[#a71d18] text-white p-3 rounded-xl mb-4">
          Bu konuşma tamamlandı (sadece geçmiş görüntülenir).
        </div>
      )}

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto rounded-2xl border-2 border-[#37357f]/15 bg-white/80 p-4 space-y-3 mb-4">
        {conversation?.scheduledTime && messages.length > 0 && (
          <div className="flex justify-center">
            <div className="bg-[#37357f]/10 text-[#37357f] text-sm px-4 py-2 rounded-full">
              📅 Görüşme planlandı:{" "}
              {conversation.scheduledTime.toDate().toLocaleTimeString()}
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-xl text-white ${
                msg.sender === "admin" ? "bg-[#4f8f11]" : "bg-[#37357f]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      {isFinished ? (
        <div className="text-center text-red-200 bg-red-500/20 p-3 rounded-xl">
          Sohbet kapatıldı. Yalnızca geçmişi görüntüleyebilirsiniz.
        </div>
      ) : (
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg"
            placeholder="Yanıtla..."
          />
          <button className="bg-[#4f8f11] hover:bg-[#3a6b0d] cursor-pointer px-6 py-2 rounded-lg text-white font-bold">
            Gönder
          </button>
        </form>
      )}
    </div>
  );
}
