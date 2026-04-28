// components/admin/AddPetForm.tsx
"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const YEARS = Array.from({ length: 31 }, (_, i) => i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i);

const MEDICAL_OPTIONS = [
  "Healthy",
  "Vaccinated",
  "Neutered",
  "Spayed",
  "Under Treatment",
  "Special Needs",
];

interface FormData {
  name: string;
  species: "dog" | "cat";
  breed: string;
  years: number;
  months: number;
  description: string;
  medicalStatus: string;
  imageUrl: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  species: "dog",
  breed: "",
  years: 0,
  months: 0,
  description: "",
  medicalStatus: MEDICAL_OPTIONS[0],
  imageUrl: "",
};

export default function AddPetForm() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "years" || name === "months" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const totalAgeMonths = form.years * 12 + form.months;

      await addDoc(collection(db, "pets"), {
        name: form.name,
        species: form.species,
        breed: form.breed,
        age: totalAgeMonths,
        description: form.description,
        medicalStatus: form.medicalStatus,
        availability: "available",
        imageUrl: form.imageUrl || "", // empty string if nothing entered
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setMessage("✅ Pet added successfully!");
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add pet. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20"
    >
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <span>🐾</span> Add New Pet
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Name *
            </label>
            <input
              name="name"
              placeholder="e.g. Buddy"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-white text-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Species *
              </label>
              <select
                name="species"
                value={form.species}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white text-black"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Breed *
              </label>
              <input
                name="breed"
                placeholder="e.g. Golden Retriever"
                value={form.breed}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-white text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Age *
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <select
                  name="years"
                  value={form.years}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white text-black"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y} {y === 1 ? "year" : "years"}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <select
                  name="months"
                  value={form.months}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white text-black"
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m} {m === 1 ? "month" : "months"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Medical Status *
            </label>
            <select
              name="medicalStatus"
              value={form.medicalStatus}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white text-black"
            >
              {MEDICAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="A few words about the pet..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-white text-black resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Photo URL (optional)
          </label>
          <input
            name="imageUrl"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white text-black"
          />
          {form.imageUrl && (
            <div className="mt-3 relative w-full h-48 rounded-lg overflow-hidden bg-gray-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          )}
          {!form.imageUrl && (
            <div className="mt-3 border-2 border-dashed border-white/40 rounded-xl p-6 text-center text-white/70">
              <p className="text-4xl mb-2">🖼️</p>
              <p className="font-medium">No image URL provided</p>
              <p className="text-sm">A placeholder will be shown</p>
            </div>
          )}
        </div>
      </div>

      {message && (
        <p
          className={`text-sm mt-4 font-medium ${
            message.startsWith("✅") ? "text-green-300" : "text-red-300"
          }`}
        >
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-[#e98b33] hover:bg-[#e4aa3f] text-white py-3 rounded-lg font-bold disabled:opacity-50 transition-colors"
      >
        {loading ? "Saving Pet..." : "Add Pet"}
      </button>
    </form>
  );
}
