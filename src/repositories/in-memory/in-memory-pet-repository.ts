import { Pet, Prisma } from '@prisma/client';
import { IPetRepository, ListPetsFiltersDTO } from '../pet-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryPetRepository implements IPetRepository {
  private pets: Pet[] = [];

  async create(petData: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = { ...petData, id: randomUUID() };
    this.pets.push(pet as Pet);
    return pet as Pet;
  }

  async findById(petId: string): Promise<Pet | null> {
    return this.pets.find(pet => pet.id === petId) || null;
  }

  async listAll(filters: ListPetsFiltersDTO, page: number): Promise<Pet[]> {
    let filteredPets = this.pets.filter(pet => pet.city === filters.city);

    if (filters.breed) {
      filteredPets = filteredPets.filter(pet => pet.breed === filters.breed);
    }

    if (filters.size) {
      filteredPets = filteredPets.filter(pet => pet.size === filters.size);
    }

    if (filters.color) {
      filteredPets = filteredPets.filter(pet => pet.color === filters.color);
    }

    if (filters.ageRange) {
      const [minAge, maxAge] = filters.ageRange;

      filteredPets = filteredPets.filter(pet => {
        if (minAge !== undefined && maxAge !== undefined) {
          return pet.age >= minAge && pet.age <= maxAge;
        } else if (minAge !== undefined) {
          return pet.age >= minAge;
        } else if (maxAge !== undefined) {
          return pet.age <= maxAge;
        }
        return true;
      });
    }

    const start = (page - 1) * 20;
    const end = start + 20;
    return filteredPets.slice(start, end);
  }

  async update(pet: Pet): Promise<Pet> {
    const index = this.pets.findIndex(p => p.id === pet.id);

    if (index !== -1) {
      this.pets[index] = pet;
    }

    return pet;
  }

  async delete(petId: string): Promise<void> {
    this.pets = this.pets.filter(pet => pet.id !== petId);
  }
}
