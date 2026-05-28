import Hero from "../../components/hero";
import PetCategories from "../../components/PetCategories";
import EmailForm from "../../components/EmailForm";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <PetCategories />
      <EmailForm />
    </div>
  );
}
