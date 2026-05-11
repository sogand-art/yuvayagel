/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  imageUrl: string;
};

export default function LikedPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const likesQuery = query(
        collection(db, "likedPets"),
        where("userId", "==", user.uid),
      );

      const likesSnap = await getDocs(likesQuery);

      const petPromises = likesSnap.docs.map(async (likeDoc) => {
        const petId = likeDoc.data().petId;

        const petSnap = await getDoc(doc(db, "pets", petId));

        if (!petSnap.exists()) return null;

        return {
          id: petSnap.id,
          ...petSnap.data(),
        } as Pet;
      });

      const petResults = await Promise.all(petPromises);

      setPets(petResults.filter(Boolean) as Pet[]);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-900 p-6">
      <h1 className="text-4xl font-bold text-white mb-8">❤️ Liked Pets</h1>

      {pets.length === 0 ? (
        <p className="text-white/70">You haven&apos;t liked any pets yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {pets.map((pet) => (
            <Link
              key={pet.id}
              href={`/pets/${pet.id}`}
              className="block bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative w-full h-56 bg-gray-800 overflow-hidden flex items-center justify-center">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {pet.name}

                  <span className="text-sm font-normal text-white/60">
                    ({pet.species})
                  </span>
                </h2>

                <p className="text-white/80 text-sm mt-1">
                  <span className="font-medium">Breed:</span> {pet.breed}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
