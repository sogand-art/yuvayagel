/* eslint-disable react-hooks/static-components */
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
};

export default function AdminMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState({
    active: true,
    scheduled: true,
    finished: false,
  });

  useEffect(() => {
    const q = query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Conversation[];

      setConversations(convs);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <p className="text-[#37357f] text-center font-semibold">Loading...</p>
    );
  }

  const activeConvs = conversations.filter((c) => c.status === "active");
  const scheduledConvs = conversations.filter((c) => c.status === "scheduled");
  const finishedConvs = conversations.filter((c) => c.status === "finished");

  const cardClass =
    "block rounded-2xl border-2 border-[#37357f]/10 bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#79c617]";

  const renderConversation = (conv: Conversation) => (
    <Link
      key={conv.id}
      href={`/admin/messages/${conv.id}`}
      className={cardClass}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-[#171717]">
            {conv.petName} -{" "}
            <span className="text-sm font-normal">{conv.userName}</span>
          </h2>

          <p className="text-[#171717]/60 text-sm">{conv.userEmail}</p>

          <p className="text-[#171717]/80 text-sm mt-1">
            Status:{" "}
            <span
              className={`capitalize ${
                conv.status === "scheduled"
                  ? "text-[#4f8f11]"
                  : conv.status === "finished"
                    ? "text-red-400"
                    : "text-[#4f8f11]"
              }`}
            >
              {conv.status}
            </span>
          </p>

          {conv.scheduledTime && (
            <p className="text-[#171717]/60 text-xs mt-1">
              Appointment: {conv.scheduledTime.toDate().toLocaleString()}
            </p>
          )}
        </div>

        <span className="text-xs text-[#171717]/50">
          {conv.createdAt?.toDate().toLocaleDateString()}
        </span>
      </div>
    </Link>
  );

  const Section = ({
    title,
    color,
    count,
    openKey,
    children,
  }: {
    title: string;
    color: string;
    count: number;
    openKey: keyof typeof open;
    children: React.ReactNode;
  }) => {
    const isOpen = open[openKey];

    return (
      <div className="mb-8">
        {/* HEADER */}
        <button
          onClick={() =>
            setOpen((prev) => ({ ...prev, [openKey]: !prev[openKey] }))
          }
          className={`w-full flex justify-between items-center mb-3 ${color} font-bold text-lg cursor-pointer`}
        >
          <span>
            {title} <span className="text-sm opacity-60">({count})</span>
          </span>

          <span
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* DROPDOWN */}
        <div
          className={`
          overflow-hidden
          transition-all duration-500 ease-in-out
          ${isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          <div
            className={`
            space-y-4
            transform transition-all duration-500 ease-in-out
            ${isOpen ? "translate-y-0" : "-translate-y-2"}
          `}
          >
            {children}
          </div>
        </div>
      </div>
    );
  };

  const Empty = ({ text }: { text: string }) => (
    <p className="text-[#37357f]/60">{text}</p>
  );

  return (
    <div>
      <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#37357f]">
        Adoption conversations
      </p>

      <h1 className="mt-2 text-3xl font-extrabold text-[#171717] mb-8">
        Messages
      </h1>

      {/* ACTIVE */}
      <Section
        title="Active Conversations"
        color="text-[#4f8f11]"
        count={activeConvs.length}
        openKey="active"
      >
        {activeConvs.length === 0 ? (
          <Empty text="No active conversations." />
        ) : (
          activeConvs.map(renderConversation)
        )}
      </Section>

      {/* SCHEDULED */}
      <Section
        title="Scheduled Meetings"
        color="text-blue-500"
        count={scheduledConvs.length}
        openKey="scheduled"
      >
        {scheduledConvs.length === 0 ? (
          <Empty text="No scheduled meetings." />
        ) : (
          scheduledConvs.map(renderConversation)
        )}
      </Section>

      {/* FINISHED */}
      <Section
        title="Finished Conversations"
        color="text-red-400"
        count={finishedConvs.length}
        openKey="finished"
      >
        {finishedConvs.length === 0 ? (
          <Empty text="No finished conversations." />
        ) : (
          finishedConvs.map(renderConversation)
        )}
      </Section>
    </div>
  );
}
