"use client";

import LoginForm from "@/components/Login/login-form";
import RightSideDesign from "@/components/Login/right-side-design";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LoginForm></LoginForm>
      <RightSideDesign></RightSideDesign>
    </div>
  );
}
