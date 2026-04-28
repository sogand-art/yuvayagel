/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(public)/pets/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  medicalStatus: string;
  imageUrl: string;
  availability: string;
};

export default function PetDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  // Auth + profile
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const profile = userDoc.exists() ? userDoc.data() : {};
        setCurrentUser({
          uid: user.uid,
          name: profile.name || user.displayName || "",
          email: profile.email || user.email || "",
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsub();
  }, []);

  // Prefill name/email when logged in
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
      }));
    }
  }, [currentUser]);

  // Fetch pet
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "pets", id));
        if (snap.exists()) setPet({ id: snap.id, ...snap.data() } as Pet);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return; // shouldn't happen, form is only shown when logged in
    setSending(true);

    try {
      const convRef = await addDoc(collection(db, "conversations"), {
        petId: pet?.id || null,
        petName: pet?.name || "Unknown",
        userName: formData.name,
        userEmail: formData.email,
        userId: currentUser.uid,
        status: "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

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
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  if (!pet)
    return (
      <div className="min-h-screen bg-green-900 flex flex-col items-center justify-center gap-4">
        <p className="text-white">Pet not found.</p>
        <Link href="/pets" className="text-[#e98b33] underline">
          ← Back
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-green-900 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/pets"
          className="text-[#e98b33] hover:underline mb-6 inline-block"
        >
          ← Back to Pets
        </Link>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-xl">
          <div className="relative w-full h-64 md:h-96 bg-gray-800">
            {pet.imageUrl ? (
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="w-full h-full object-contain p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement!;
                  parent.classList.add(
                    "flex",
                    "items-center",
                    "justify-center",
                  );
                  parent.innerHTML =
                    '<span class="text-white/50 text-6xl">🐾</span>';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-6xl">
                🐾
              </div>
            )}
          </div>

          <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-6">
              {pet.name}{" "}
              <span className="text-lg font-normal text-white/60">
                ({pet.species})
              </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div>
                <p className="text-white/60 text-sm uppercase">Breed</p>
                <p className="text-lg">{pet.breed}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm uppercase">Age</p>
                <p className="text-lg">
                  {Math.floor(pet.age / 12)} years {pet.age % 12} months
                </p>
              </div>
              <div>
                <p className="text-white/60 text-sm uppercase">Medical</p>
                <p className="text-lg">{pet.medicalStatus || "—"}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm uppercase">Availability</p>
                <p className="text-lg capitalize">{pet.availability}</p>
              </div>
            </div>
            {pet.description && (
              <div className="mt-6">
                <p className="text-white/60 text-sm uppercase mb-2">
                  About {pet.name}
                </p>
                <p className="text-white/90 leading-relaxed">
                  {pet.description}
                </p>
              </div>
            )}

            {!currentUser ? (
              <Link
                href={`/login?redirect=/pets/${pet.id}`}
                className="mt-8 inline-flex items-center gap-2 bg-[#e98b33] hover:bg-[#e4aa3f] text-white px-8 py-3 rounded-full font-semibold transition"
              >
                🔐 Login to Inquire
              </Link>
            ) : !showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="mt-8 inline-flex items-center gap-2 bg-[#e98b33] hover:bg-[#e4aa3f] text-white px-8 py-3 rounded-full font-semibold"
              >
                💬 Inquire About {pet.name}
              </button>
            ) : (
              <div className="mt-8">
                <form onSubmit={handleContact} className="space-y-4">
                  <h3 className="text-xl font-semibold text-white">
                    Send an Inquiry
                  </h3>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-white text-black disabled:bg-gray-200 disabled:cursor-not-allowed"
                  />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-white text-black disabled:bg-gray-200 disabled:cursor-not-allowed"
                  />
                  <textarea
                    placeholder={`I'm interested in ${pet.name}...`}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={4}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white text-black resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={sending}
                      className="bg-[#e98b33] hover:bg-[#e4aa3f] text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50"
                    >
                      {sending ? "Starting..." : "Start Conversation"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="text-white/70 hover:text-white underline"
                    >
                      Cancel
                    </button>
                  </div>
                  {formStatus === "error" && (
                    <p className="text-red-400 text-sm">
                      ❌ Failed. Please try again.
                    </p>
                  )}
                </form>
              </div>
            )}
            <p className="text-white/50 text-sm mt-4">
              Adoption is completed in person. After you send an inquiry, an
              admin will reply in your personal conversation thread.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
