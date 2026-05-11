/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

type AdoptedPet = {
  id: string;

  petName: string;
  petImage: string;
  petBreed: string;
  petSpecies: string;

  adopterName: string;
  adopterEmail: string;

  adoptedAt: Timestamp;
};

export default function AdoptedPetsPage() {
  const [pets, setPets] = useState<AdoptedPet[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "adoptedPets"),
      orderBy("adoptedAt", "desc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdoptedPet[];

      setPets(data);
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-green-900 p-6">
      <h1 className="text-4xl font-bold text-white mb-8">Adopted Pets</h1>

      {pets.length === 0 ? (
        <p className="text-white/70">No adopted pets yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
            >
              <div className="w-full h-56 bg-gray-800 overflow-hidden">
                <img
                  src={pet.petImage}
                  alt={pet.petName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <h2 className="text-2xl font-bold text-white">{pet.petName}</h2>

                <p className="text-white/70">{pet.petBreed}</p>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-white font-semibold">Adopted By</p>

                  <p className="text-white/80">{pet.adopterName}</p>

                  <p className="text-white/60 text-sm">{pet.adopterEmail}</p>

                  <p className="text-white/50 text-xs mt-3">
                    {pet.adoptedAt?.toDate().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
