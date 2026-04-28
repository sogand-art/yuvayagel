// app/(public)/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-green-900 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            About Yuvaya Gel
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Every pet deserves a loving home. We’re here to make that connection
            happen.
          </p>
        </div>

        {/* Story + Mission in two cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🐾</span> Our Story
            </h2>
            <p className="text-white/80 leading-relaxed">
              Yuvaya Gel started with a simple belief: no animal should be left
              without a family. What began as a small shelter has grown into a
              full‑fledged adoption and care center, connecting dogs and cats
              with people who love them.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🎯</span> Our Mission
            </h2>
            <p className="text-white/80 leading-relaxed">
              We rescue, rehabilitate, and rehome pets in need. Every adoption
              is a fresh start — we ensure each animal is healthy, vaccinated,
              and ready to become part of a new family.
            </p>
          </div>
        </div>

        {/* Core Values / Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Why Choose Yuvaya Gel?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🏥",
                title: "Veterinary Care",
                desc: "All pets receive full medical checks, vaccinations, and are spayed/neutered before adoption.",
              },
              {
                icon: "❤️",
                title: "Personalized Matching",
                desc: "We learn your lifestyle to match you with a pet that truly fits your home and heart.",
              },
              {
                icon: "📋",
                title: "Transparent Process",
                desc: "No hidden fees or surprises. You’ll know everything about your pet’s health and history.",
              },
              {
                icon: "🏡",
                title: "In‑Person Adoption",
                desc: "Adoptions happen in person so you and your new friend can meet before taking the leap.",
              },
              {
                icon: "💬",
                title: "Ongoing Support",
                desc: "Even after adoption, our team stays in touch to help with any questions or concerns.",
              },
              {
                icon: "🐶🐱",
                title: "All Breeds Welcome",
                desc: "We care for both dogs and cats of every breed, age, and background.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/20 transition"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-[#e98b33]/10 rounded-2xl p-8 border border-[#e98b33]/30">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to meet your new best friend?
          </h2>
          <p className="text-white/80 mb-6">
            Browse our available pets and start a conversation today.
          </p>
          <Link
            href="/pets"
            className="inline-block bg-[#e98b33] hover:bg-[#e4aa3f] text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Meet Our Pets
          </Link>
        </div>
      </div>
    </div>
  );
}
