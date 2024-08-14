import { Prisma, Pet } from '@prisma/client';
import { IPetRepository, ListPetsFiltersDTO } from '../pet-repository';
import { prisma } from '@/lib/prisma';

export class PrismaPetRepository implements IPetRepository {
  async create(petData: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = await prisma.pet.create({
      data: petData,
    });

    return pet;
  }

  async findById(petId: string): Promise<Pet | null> {
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
    });

    return pet;
  }

  async listAll(filters: ListPetsFiltersDTO, page: number): Promise<Pet[]> {
    const { city, breed, size, color, ageRange } = filters;

    const pets = await prisma.pet.findMany({
      where: {
        city,
        breed,
        size,
        color,
        age: ageRange ? { gte: ageRange[0], lte: ageRange[1] } : undefined,
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    return pets;
  }

  async update(pet: Pet): Promise<Pet> {
    const petUpdated = await prisma.pet.update({
      where: { id: pet.id },
      data: pet,
    });

    return petUpdated;
  }

  async delete(petId: string): Promise<void> {
    await prisma.pet.delete({
      where: { id: petId },
    });
  }
}
