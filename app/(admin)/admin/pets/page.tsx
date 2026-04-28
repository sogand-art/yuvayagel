// app/(admin)/pets/page.tsx
import AddPetForm from "@/components/Admin/AddPetForm";
import PetList from "@/components/Admin/PetList";

export default function PetsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Manage Pets</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <AddPetForm />
        <PetList />
      </div>
    </div>
  );
}
