/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
// app/(public)/pets/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { auth, db } from "@/lib/firebase";

import { onAuthStateChanged } from "firebase/auth";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat";
  breed: string;
  age: number;
  description: string;
  medicalStatus: string;
  imageUrl: string;
  availability: string;
};

function PublicPetsContent() {
  const searchParams = useSearchParams();

  const [pets, setPets] = useState<Pet[]>([]);
  const [filter, setFilter] = useState<"all" | "dog" | "cat">("all");
  const [loading, setLoading] = useState(true);

  const [likedPets, setLikedPets] = useState<string[]>([]);

  // Sync filter with URL
  useEffect(() => {
    const speciesParam = searchParams.get("species");

    if (speciesParam === "dog" || speciesParam === "cat") {
      setFilter(speciesParam);
    } else {
      setFilter("all");
    }
  }, [searchParams]);

  // Fetch pets
  useEffect(() => {
    const q = query(
      collection(db, "pets"),
      where("availability", "==", "available"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedPets: Pet[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Pet[];

      setPets(fetchedPets);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Fetch liked pets
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLikedPets([]);
        return;
      }

      const q = query(
        collection(db, "likedPets"),
        where("userId", "==", user.uid),
      );

      const snap = await getDocs(q);

      const likedIds = snap.docs.map((doc) => doc.data().petId);

      setLikedPets(likedIds);
    });

    return () => unsub();
  }, []);

  // Toggle like
  const toggleLike = async (petId: string) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Lütfen önce giriş yapın.");
      return;
    }

    const q = query(
      collection(db, "likedPets"),
      where("userId", "==", user.uid),
      where("petId", "==", petId),
    );

    const snap = await getDocs(q);

    // Unlike
    if (!snap.empty) {
      await deleteDoc(doc(db, "likedPets", snap.docs[0].id));

      setLikedPets((prev) => prev.filter((id) => id !== petId));
    }
    // Like
    else {
      await addDoc(collection(db, "likedPets"), {
        userId: user.uid,
        petId,
        createdAt: serverTimestamp(),
      });

      setLikedPets((prev) => [...prev, petId]);
    }
  };

  const filteredPets =
    filter === "all" ? pets : pets.filter((pet) => pet.species === filter);

  return (
    <div className="brand-page-bg min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#79c617]">
            Uygun dostlar
          </p>
          <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-[#171717]">
            Evcil Hayvanlarımızı Gör
          </h1>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-3 mb-10 ">
          {(["all", "dog", "cat"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-6 py-2 rounded-full font-semibold cursor-pointer transition-colors ${
                filter === option
                  ? "bg-[#37357f] text-white shadow-md"
                  : "border-2 border-[#37357f]/20 bg-white text-[#37357f] hover:border-[#79c617]"
              }`}
            >
              {option === "all"
                ? "Tümü"
                : option === "dog"
                  ? "Köpekler"
                  : "Kediler"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-[#37357f] text-center text-lg font-semibold">
            Evcil hayvanlar yükleniyor...
          </p>
        ) : filteredPets.length === 0 ? (
          <p className="text-[#37357f]/70 text-center text-lg">
            Hiç evcil hayvan bulunamadı
            {filter !== "all"
              ? ` (${filter === "dog" ? "Köpek" : "Kedi"} araması)`
              : ""}
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <Link
                key={pet.id}
                href={`/pets/${pet.id}`}
                className="block overflow-hidden rounded-[1.75rem] border-4 border-[#37357f]/15 bg-white shadow-lg transition hover:-translate-y-1 hover:border-[#79c617] hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative w-full h-56 overflow-hidden">
                  {pet.imageUrl ? (
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#37357f]/60 text-xl font-bold">
                      Pati
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  {/* Like Button */}
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(pet.id);
                      }}
                      className="rounded-full bg-[#fff4c7] px-3 py-1 text-xl hover:scale-110 transition-transform"
                      aria-label={
                        likedPets.includes(pet.id)
                          ? `Beğenmekten vazgeç ${pet.name}`
                          : `Beğen ${pet.name}`
                      }
                    >
                      {likedPets.includes(pet.id) ? "❤️" : "🤍"}
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2">
                    {pet.name}

                    <span className="rounded-full bg-[#79c617]/20 px-2 py-0.5 text-sm font-bold text-[#37357f]">
                      {pet.species === "dog" ? "Köpek" : "Kedi"}
                    </span>
                  </h2>

                  <p className="text-[#171717]/75 text-sm mt-3">
                    <span className="font-medium">Irk:</span> {pet.breed}
                  </p>

                  <p className="text-[#171717]/75 text-sm">
                    <span className="font-medium">Yaş:</span>{" "}
                    {Math.floor(pet.age / 12)} yıl {pet.age % 12} ay
                  </p>

                  <p className="text-[#171717]/75 text-sm">
                    <span className="font-medium">Sağlık:</span>{" "}
                    {pet.medicalStatus || "—"}
                  </p>

                  {pet.description && (
                    <p className="text-[#171717]/55 text-sm mt-2 line-clamp-2">
                      {pet.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicPetsPage() {
  return (
    <Suspense
      fallback={
        <div className="brand-page-bg min-h-screen py-12 px-4 md:px-8">
          <p className="text-center text-lg font-semibold text-[#37357f]">
            Evcil hayvanlar yükleniyor...
          </p>
        </div>
      }
    >
      <PublicPetsContent />
    </Suspense>
  );
}
