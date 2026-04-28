// types/pet.ts
export interface Pet {
  id?: string;
  name: string;
  species: "dog" | "cat";
  breed: string;
  age: number;
  description: string;
  medicalStatus: string;
  availability: "available" | "adopted";
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}
