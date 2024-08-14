import { PrismaPetRepository } from '@/repositories/prisma/prisma-pet-repository';
import { RegisterPetUseCase } from '../register-pet';
import { PrismaOrgRepository } from '@/repositories/prisma/prisma-org-repository';

export function makeRegisterPetUseCase() {
  const prismaOrgRepository = new PrismaOrgRepository();
  const prismaPetRepository = new PrismaPetRepository();

  const registerPetUseCase = new RegisterPetUseCase(
    prismaPetRepository,
    prismaOrgRepository
  );

  return registerPetUseCase;
}
