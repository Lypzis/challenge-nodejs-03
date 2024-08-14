import { PrismaOrgRepository } from '@/repositories/prisma/prisma-org-repository';
import { AuthenticateOrgUseCase } from '../authenticate';

export function makeAuthenticateUseCase() {
  const prismaOrgRepository = new PrismaOrgRepository();
  const autheticateUseCase = new AuthenticateOrgUseCase(prismaOrgRepository);

  return autheticateUseCase;
}
