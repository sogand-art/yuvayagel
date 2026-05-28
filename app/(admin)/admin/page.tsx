// app/(admin)/page.tsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import type { Pet } from "@/types/pet";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    dogs: 0,
    cats: 0,
    available: 0,
    adopted: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "pets"));
    const unsub = onSnapshot(q, (snapshot) => {
      const pets = snapshot.docs.map((doc) => doc.data()) as Pet[];
      const dogs = pets.filter((p) => p.species === "dog").length;
      const cats = pets.filter((p) => p.species === "cat").length;
      const available = pets.filter(
        (p) => p.availability === "available",
      ).length;
      const adopted = pets.filter((p) => p.availability === "adopted").length;

      setStats({
        total: pets.length,
        dogs,
        cats,
        available,
        adopted,
      });
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <p className="text-[#37357f] text-lg font-semibold">
        Loading statistics...
      </p>
    );
  }

  const cards = [
    { label: "Total Pets", value: stats.total },
    { label: "Dogs", value: stats.dogs },
    { label: "Cats", value: stats.cats },
    { label: "Available", value: stats.available },
    { label: "Adopted", value: stats.adopted },
  ];

  return (
    <div>
      <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#37357f]">
        Shelter operations
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-[#171717] mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border-2 border-[#37357f]/15 bg-white p-6 shadow-md"
          >
            <p className="text-[#37357f] text-sm font-extrabold uppercase tracking-wide">
              {card.label}
            </p>
            <p className="text-4xl font-extrabold text-[#171717] mt-2">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
