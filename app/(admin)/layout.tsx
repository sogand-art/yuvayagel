// app/(admin)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Sidebar from "@/components/Admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // on the login page we never block – the form handles its own logic
      if (pathname === "/admin/login") {
        setLoading(false);
        return;
      }

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          router.replace("/admin/login");
        }
      } catch {
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, pathname]);

  // Show nothing while checking (except for login page which handles its own UI)
  if (loading) {
    if (pathname === "/admin/login") return <>{children}</>;
    return (
      <div className="brand-page-bg min-h-screen flex items-center justify-center">
        <p className="text-[#37357f] text-xl font-semibold">
          Checking permissions...
        </p>
      </div>
    );
  }

  // On the login page, never show the sidebar – just the form
  if (pathname === "/admin/login") return <>{children}</>;

  if (!isAdmin) return null;

  return (
    <div className="brand-page-bg flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
