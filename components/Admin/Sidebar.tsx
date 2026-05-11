// components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pets", label: "Pets" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/adopted", label: "Adopted" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-green-800 min-h-screen p-6 flex flex-col gap-2">
      <h2 className="text-2xl font-bold text-white mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                isActive ? "bg-white/20 shadow" : "hover:bg-white/10"
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
          className="block px-4 py-2 text-white/70 hover:text-white text-sm"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
