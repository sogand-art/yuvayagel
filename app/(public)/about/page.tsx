// app/(public)/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="brand-page-bg min-h-screen px-4 py-12 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[0.18em] text-[#4f8f11]">
            Partner shelter story
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#171717] mb-4">
            About Yuvaya Gel
          </h1>
          <p className="text-lg md:text-xl text-[#37357f] max-w-2xl mx-auto">
            Every pet deserves a loving home. We’re here to make that connection
            happen.
          </p>
        </div>

        {/* Story + Mission in two cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-[2rem] border-4 border-[#37357f] bg-[#fff9df] p-6 shadow-lg md:p-8">
            <h2 className="text-2xl font-bold text-[#37357f] mb-4 flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-[#79c617]" /> Our Story
            </h2>
            <p className="text-[#171717]/75 leading-relaxed">
              Yuvaya Gel started with a simple belief: no animal should be left
              without a family. What began as a small shelter has grown into a
              full‑fledged adoption and care center, connecting dogs and cats
              with people who love them.
            </p>
          </div>

          <div className="rounded-[2rem] border-4 border-[#a71d18] bg-[#fff9df] p-6 shadow-lg md:p-8">
            <h2 className="text-2xl font-bold text-[#37357f] mb-4 flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-[#a71d18]" /> Our Mission
            </h2>
            <p className="text-[#171717]/75 leading-relaxed">
              We rescue, rehabilitate, and rehome pets in need. Every adoption
              is a fresh start. We ensure each animal is healthy, vaccinated,
              and ready to become part of a new family.
            </p>
          </div>
        </div>

        {/* Core Values / Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#171717] text-center mb-10">
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
                className="rounded-2xl border-2 border-[#37357f]/15 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:border-[#79c617]"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold text-[#37357f] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#171717]/70 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center rounded-[2rem] border-4 border-[#171717] bg-[#37357f] p-8 shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to meet your new best friend?
            <br />
          </h2>
          <Link
            href="/pets"
            className="inline-block bg-[#4f8f11] hover:bg-[#3a6b0d] text-white px-8 py-3 rounded-full font-bold transition-colors"
          >
            Meet Our Pets
          </Link>
        </div>
      </div>
    </div>
  );
}
