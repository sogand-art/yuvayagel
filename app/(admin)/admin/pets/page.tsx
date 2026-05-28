// app/(admin)/pets/page.tsx
import AddPetForm from "@/components/Admin/AddPetForm";
import PetList from "@/components/Admin/PetList";

export default function PetsPage() {
  return (
    <div>
      <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#37357f]">
        Adoption inventory
      </p>
      <h1 className="mt-2 text-3xl font-extrabold text-[#171717] mb-8">
        Manage Pets
      </h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <AddPetForm />
        <PetList />
      </div>
    </div>
  );
}
