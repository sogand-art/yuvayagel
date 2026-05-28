/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login?redirect=/liked");
        return;
      }

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
  }, [router]);

  if (loading) {
    return (
      <div className="brand-page-bg min-h-screen flex items-center justify-center text-[#37357f] font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="brand-page-bg min-h-screen p-6">
      <h1 className="text-4xl font-extrabold text-[#171717] mb-8">
        Liked Pets
      </h1>

      {pets.length === 0 ? (
        <p className="text-[#37357f]/70">
          You haven&apos;t liked any pets yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {pets.map((pet) => (
            <Link
              key={pet.id}
              href={`/pets/${pet.id}`}
              className="block overflow-hidden rounded-[1.75rem] border-4 border-[#37357f]/15 bg-white shadow-lg transition hover:-translate-y-1 hover:border-[#79c617] hover:shadow-xl"
            >
              <div className="relative w-full h-56 bg-transparent overflow-hidden flex items-center justify-center">
                <img
                  src={pet.imageUrl}
                  alt={pet.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-[#171717] flex items-center gap-2">
                  {pet.name}

                  <span className="rounded-full bg-[#79c617]/20 px-2 py-0.5 text-sm font-bold text-[#37357f]">
                    ({pet.species})
                  </span>
                </h2>

                <p className="text-[#171717]/75 text-sm mt-3">
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
