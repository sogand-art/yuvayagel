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
    return <p className="text-white text-lg">Loading statistics…</p>;
  }

  const cards = [
    { label: "Total Pets", value: stats.total },
    { label: "🐶 Dogs", value: stats.dogs },
    { label: "🐱 Cats", value: stats.cats },
    { label: "✅ Available", value: stats.available },
    { label: "🏡 Adopted", value: stats.adopted },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
          >
            <p className="text-white/80 text-sm uppercase tracking-wide">
              {card.label}
            </p>
            <p className="text-4xl font-bold text-white mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
