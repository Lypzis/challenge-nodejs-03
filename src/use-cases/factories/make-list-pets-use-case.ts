import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet-repository';
import { ListPetsUseCase } from '../list-pets';

export function makeListPetsUseCase() {
  const prismaPetRepository = new PrismaPetRepository();

  const createOrgUseCase = new ListPetsUseCase(prismaPetRepository);

  return createOrgUseCase;
}
