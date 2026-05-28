/* eslint-disable react-hooks/set-state-in-effect */
// components/EmailForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

export default function EmailForm() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    uid: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  // Listen for auth state and pre‑fill if logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const data = userDoc.exists() ? userDoc.data() : {};
        setCurrentUser({
          uid: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || "",
          email: data.email || firebaseUser.email || "",
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Prefill name & email when user is available
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
      }));
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFormStatus("idle");

    try {
      // Create conversation document (general inquiry – no pet)
      const convRef = await addDoc(collection(db, "conversations"), {
        petId: null,
        petName: "General Inquiry from Homepage",
        userName: formData.name,
        userEmail: formData.email,
        userId: currentUser?.uid || null,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Add the first message
      await addDoc(collection(db, "messages"), {
        conversationId: convRef.id,
        sender: "user",
        text: formData.message,
        createdAt: serverTimestamp(),
      });

      router.push(`/messages/${convRef.id}`);
    } catch (err) {
      console.error(err);
      setFormStatus("error");
      setSending(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden px-6 py-16 text-white md:py-20">
      <div className="brand-dark-bg relative mx-auto max-w-3xl rounded-[2rem] border border-white/10 p-8 shadow-[0_28px_70px_rgba(0,0,0,0.32)] md:p-12">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Send Us a Message
        </h2>
        <p className="text-center text-[#fff4c7] mb-8">
          Drop us a message. We would love to hear from you.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={!!currentUser}
            className="rounded-xl border-2 border-[#fff4c7]/30 bg-white/10 p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#79c617] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
          />

          <input
            type="email"
            placeholder="Your Email *"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            disabled={!!currentUser}
            className="rounded-xl border-2 border-[#fff4c7]/30 bg-white/10 p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#79c617] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
          />

          <textarea
            placeholder="Your Message *"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
            className="resize-none rounded-xl border-2 border-[#fff4c7]/30 bg-white/10 p-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#79c617]"
          ></textarea>

          <button
            type="submit"
            disabled={sending}
            className="rounded-xl py-3 font-bold text-white transition-colors bg-[#4f8f11] hover:bg-[#355e0c] disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Message"}
          </button>

          {formStatus === "error" && (
            <p className="text-red-300 text-sm text-center">
              Failed to send. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
