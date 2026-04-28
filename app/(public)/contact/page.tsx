/* eslint-disable react-hooks/set-state-in-effect */
// app/(public)/contact/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect } from "react";

export default function ContactPage() {
  const router = useRouter();

  // Auth state – auto‑fill name & email if logged in
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  // Listen for auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCurrentUser({
            name: data.name || firebaseUser.displayName || "",
            email: data.email || firebaseUser.email || "",
          });
        } else {
          setCurrentUser({
            name: firebaseUser.displayName || "",
            email: firebaseUser.email || "",
          });
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Prefill when user is loaded
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
      // Create conversation document (general inquiry)
      const convRef = await addDoc(collection(db, "conversations"), {
        petId: null,
        petName: `General Inquiry – ${formData.subject || "No Subject"}`,
        userName: formData.name,
        userEmail: formData.email,
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

      // Redirect to the public chat page
      router.push(`/messages/${convRef.id}`);
    } catch (err) {
      console.error(err);
      setFormStatus("error");
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-900 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center mb-12">
          Contact Us
        </h1>

        {/* Contact info cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="text-xl font-semibold text-white mb-1">Phone</h3>
            <p className="text-white/80 text-lg">+90 555 123 4567</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 text-center">
            <div className="text-4xl mb-3">✉️</div>
            <h3 className="text-xl font-semibold text-white mb-1">Email</h3>
            <p className="text-white/80 text-lg">info@yuvayagel.com</p>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>💬</span> Send Us a Message
          </h2>

          {formStatus === "success" ? (
            <div className="bg-green-800 text-white p-4 rounded-xl text-center">
              ✅ Redirecting to your conversation...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name *"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  disabled={!!currentUser}
                  className="w-full px-4 py-2 rounded-lg bg-white text-black disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
                <input
                  type="email"
                  placeholder="Your email *"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={!!currentUser}
                  className="w-full px-4 py-2 rounded-lg bg-white text-black disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>
              <input
                type="text"
                placeholder="Subject (optional)"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white text-black"
              />
              <textarea
                placeholder="Your message *"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                required
                className="w-full px-4 py-2 rounded-lg bg-white text-black resize-none"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="bg-[#e98b33] hover:bg-[#e4aa3f] text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </div>
              {formStatus === "error" && (
                <p className="text-red-400 text-sm">
                  ❌ Failed to send. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
