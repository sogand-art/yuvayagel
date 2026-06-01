// components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Kontrol Paneli" },
  { href: "/admin/pets", label: "Evcil Hayvanlar" },
  { href: "/admin/messages", label: "Mesajlar" },
  { href: "/admin/adopted", label: "Sahiplendirilmiş" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r border-white/10 bg-[#100e23]/78 p-6 flex flex-col gap-2 shadow-[18px_0_48px_rgba(0,0,0,0.24)] backdrop-blur-xl">
      <div className="mb-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#79c617]">
          Yuvaya Gel
        </p>
        <h2 className="text-2xl font-extrabold text-white">Admin Panel</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl font-bold transition-colors ${
                isActive
                  ? "bg-white/12 text-white shadow border border-white/10"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <Link
          href="/"
          className="block px-4 py-2 text-sm font-bold text-[#fff4c7]/80 hover:text-white"
        >
          ← Siteye geri dön
        </Link>
      </div>
    </aside>
  );
}
