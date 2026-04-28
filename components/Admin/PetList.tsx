// components/admin/PetList.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import type { Pet } from "@/types/pet";

export default function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pets"), (snapshot) => {
      const allPets: Pet[] = snapshot.docs
        .map((d) => {
          const data = d.data() as Omit<Pet, "id">;
          return {
            id: d.id,
            name: data.name || "",
            species: data.species || "dog",
            breed: data.breed || "",
            age: data.age || 0,
            description: data.description || "",
            medicalStatus: data.medicalStatus || "",
            availability: data.availability || "available",
            imageUrl: data.imageUrl || "",
            createdAt: (data.createdAt as unknown as Timestamp)?.toDate(),
            updatedAt: (data.updatedAt as unknown as Timestamp)?.toDate(),
          };
        })
        .filter((pet) => pet.availability !== "adopted");

      setPets(allPets);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleAdopt = async (id: string) => {
    if (!confirm("Mark this pet as adopted?")) return;
    try {
      await updateDoc(doc(db, "pets", id), {
        availability: "adopted",
        updatedAt: new Date(),
      });
    } catch {
      alert("Failed to adopt pet.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this pet permanently?")) return;
    try {
      await deleteDoc(doc(db, "pets", id));
    } catch {
      alert("Failed to delete pet.");
    }
  };

  if (loading) {
    return <p className="text-white text-center">Loading pets…</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-white">All Pets</h2>
      {pets.length === 0 && <p className="text-white/70">No pets added yet.</p>}
      {pets.map((pet) => (
        <div
          key={pet.id}
          className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex gap-4 items-start"
        >
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-700 shrink-0">
            {pet.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pet.imageUrl}
                alt={pet.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // fallback to paw if image broken
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.parentElement!.classList.add(
                    "flex",
                    "items-center",
                    "justify-center",
                  );
                  target.parentElement!.innerHTML = "🐾";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-2xl">
                🐾
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white">
              {pet.name} ({pet.species})
            </h3>
            <p className="text-white/80 text-sm">Breed: {pet.breed}</p>
            <p className="text-white/80 text-sm">
              Age: {Math.floor(pet.age / 12)} years {pet.age % 12} months
            </p>
            <p className="text-white/80 text-sm">
              Medical: {pet.medicalStatus || "—"}
            </p>
            <p
              className={`text-sm font-semibold ${
                pet.availability === "available"
                  ? "text-green-300"
                  : "text-yellow-300"
              }`}
            >
              {pet.availability}
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => handleAdopt(pet.id!)}
              className="text-green-300 text-sm font-medium hover:underline"
            >
              Adopted
            </button>
            <button
              onClick={() => handleDelete(pet.id!)}
              className="text-red-300 text-sm font-medium hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
