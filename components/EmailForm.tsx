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
    <section className="w-full py-16 px-6 bg-white">
      <div className="max-w-3xl mx-auto bg-green-900 rounded-2xl p-8 md:p-12 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Send Us a Message
        </h2>
        <p className="text-center text-white/80 mb-8">
          Drop us a message – we’d love to hear from you!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={!!currentUser}
            className="p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#e98b33] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
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
            className="p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#e98b33] disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
          />

          <textarea
            placeholder="Your Message *"
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
            className="p-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#e98b33] resize-none"
          ></textarea>

          <button
            type="submit"
            disabled={sending}
            className="bg-[#e98b33] text-white font-semibold py-3 rounded-lg hover:bg-[#e4aa3f] transition-colors disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send Message"}
          </button>

          {formStatus === "error" && (
            <p className="text-red-300 text-sm text-center">
              ❌ Failed to send. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
