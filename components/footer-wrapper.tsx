"use client";
import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function FooterWrapper() {
  const path = usePathname();
  if (
    path === "/signup" ||
    path === "/tr/signup" ||
    path === "/ar/signup" ||
    path === "/login" ||
    path === "/tr/login" ||
    path === "/ar/login" ||
    path === "/verify-email" ||
    path === "/tr/verify-email" ||
    path === "/ar/verify-email" ||
    path === "/forgot-password" ||
    path === "/tr/forgot-password" ||
    path === "/ar/forgot-password"
  )
    return null;
  return <Footer />;
}
