import { PrismaOrgRepository } from '@/repositories/prisma/prisma-org-repository';
import { CreateOrgUseCase } from '../create-org';

export function makeCreateOrgUseCase() {
  const prismaOrgRepository = new PrismaOrgRepository();
  const createOrgUseCase = new CreateOrgUseCase(prismaOrgRepository);

  return createOrgUseCase;
}
