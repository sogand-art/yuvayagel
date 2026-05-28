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
    <div>
      <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#37357f]">
        Completed adoptions
      </p>
      <h1 className="mt-2 text-4xl font-extrabold text-[#171717] mb-8">
        Adopted Pets
      </h1>

      {pets.length === 0 ? (
        <p className="text-[#37357f]/70">No adopted pets yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="overflow-hidden rounded-2xl border-2 border-[#37357f]/15 bg-white shadow-md"
            >
              <div className="w-full h-56 overflow-hidden">
                <img
                  src={pet.petImage}
                  alt={pet.petName}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="p-5">
                <h2 className="text-2xl font-bold text-[#171717]">
                  {pet.petName}
                </h2>

                <p className="text-[#171717]/70">{pet.petBreed}</p>

                <div className="mt-4 border-t border-[#37357f]/15 pt-4">
                  <p className="text-[#37357f] font-bold">Adopted By</p>

                  <p className="text-[#171717]/80">{pet.adopterName}</p>

                  <p className="text-[#171717]/60 text-sm">
                    {pet.adopterEmail}
                  </p>

                  <p className="text-[#171717]/50 text-xs mt-3">
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
