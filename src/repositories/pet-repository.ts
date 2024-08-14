import { Prisma, Pet } from '@prisma/client';

export interface ListPetsFiltersDTO {
  city: string; // Required
  breed?: string;
  size?: string;
  color?: string;
  ageRange?: [number, number];
}

export interface IPetRepository {
  // Create a new pet
  create(petData: Prisma.PetUncheckedCreateInput): Promise<Pet>;

  // Find a pet by its ID
  findById(petId: string): Promise<Pet | null>;

  // List all pets with optional filters
  listAll(filters: ListPetsFiltersDTO, page: number): Promise<Pet[]>;

  // Update a pet's information
  update(pet: Pet): Promise<Pet>;

  // Delete a pet by its ID
  delete(petId: string): Promise<void>;
}
