/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
// app/(public)/pets/page.tsx
"use client";

import { useEffect, useState } from "react";
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

export default function PublicPetsPage() {
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
      alert("Please login first.");
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
    <div className="min-h-screen bg-green-900 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Meet Our Pets
        </h1>

        {/* Filter buttons */}
        <div className="flex justify-center gap-3 mb-10">
          {(["all", "dog", "cat"] as const).map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                filter === option
                  ? "bg-[#e98b33] text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {option === "all" ? "All" : option === "dog" ? "Dogs" : "Cats"}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-white text-center text-lg">Loading pets…</p>
        ) : filteredPets.length === 0 ? (
          <p className="text-white/70 text-center text-lg">
            No pets found
            {filter !== "all" ? ` in ${filter}s` : ""}.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <Link
                key={pet.id}
                href={`/pets/${pet.id}`}
                className="block bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative w-full h-56 bg-gray-700 overflow-hidden">
                  {pet.imageUrl ? (
                    <img
                      src={pet.imageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;

                        target.style.display = "none";

                        const parent = target.parentElement;

                        if (parent) {
                          parent.classList.add(
                            "flex",
                            "items-center",
                            "justify-center",
                          );

                          parent.innerHTML =
                            '<span class="text-white/50 text-4xl">🐾</span>';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-4xl">
                      🐾
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
                      className="text-2xl hover:scale-110 transition-transform"
                    >
                      {likedPets.includes(pet.id) ? "❤️" : "🤍"}
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {pet.name}

                    <span className="text-sm font-normal text-white/60">
                      ({pet.species})
                    </span>
                  </h2>

                  <p className="text-white/80 text-sm mt-1">
                    <span className="font-medium">Breed:</span> {pet.breed}
                  </p>

                  <p className="text-white/80 text-sm">
                    <span className="font-medium">Age:</span>{" "}
                    {Math.floor(pet.age / 12)} years {pet.age % 12} months
                  </p>

                  <p className="text-white/80 text-sm">
                    <span className="font-medium">Medical:</span>{" "}
                    {pet.medicalStatus || "—"}
                  </p>

                  {pet.description && (
                    <p className="text-white/60 text-sm mt-2 line-clamp-2">
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
