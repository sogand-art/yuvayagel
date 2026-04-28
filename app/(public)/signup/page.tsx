import RightSideDesign from "@/components/Login/right-side-design";
import SignUpForm from "@/components/SignUp/signup-form";

export default function SignUp() {
  return (
    <div className="min-h-screen bg-green flex flex-col md:flex-row">
      <SignUpForm></SignUpForm>
      <RightSideDesign></RightSideDesign>
    </div>
  );
}
