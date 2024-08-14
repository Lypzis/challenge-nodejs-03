import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet-repository';
import { PrismaOrgRepository } from '@/repositories/prisma/prisma-org-repository';
import { GetPetDetailsUseCase } from '../get-pet-details';

export function makeGetPetDetailsUseCase() {
  const prismaOrgRepository = new PrismaOrgRepository();
  const prismaPetRepository = new PrismaPetRepository();

  const getPetUseCase = new GetPetDetailsUseCase(
    prismaPetRepository,
    prismaOrgRepository
  );

  return getPetUseCase;
}
