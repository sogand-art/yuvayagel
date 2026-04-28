// app/(public)/layout.tsx
import NavBarWrapper from "@/components/navbar-wrapper";
import FooterWrapper from "@/components/footer-wrapper";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBarWrapper />
      <main className="flex-1">{children}</main>
      <FooterWrapper />
    </>
  );
}
