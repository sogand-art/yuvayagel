// app/(admin)/admin/login/page.tsx
import AdminLoginForm from "@/components/Admin/AdminLoginForm";
import RightSideDesign from "@/components/Login/right-side-design";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AdminLoginForm />
      <RightSideDesign />
    </div>
  );
}
