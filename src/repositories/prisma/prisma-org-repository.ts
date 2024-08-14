import { Prisma, Org } from '@prisma/client';
import { IOrgRepository } from '../org-repository';
import { prisma } from '@/lib/prisma';

export class PrismaOrgRepository implements IOrgRepository {
  async create(orgData: Prisma.OrgUncheckedCreateInput): Promise<Org> {
    const org = await prisma.org.create({
      data: orgData,
    });

    return org;
  }

  async findById(orgId: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: { id: orgId },
    });

    return org;
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = await prisma.org.findUnique({
      where: { email },
    });

    return org;
  }

  async update(org: Org): Promise<Org> {
    const updatedOrg = await prisma.org.update({
      where: { id: org.id },
      data: org,
    });

    return updatedOrg;
  }

  async delete(orgId: string): Promise<void> {
    await prisma.org.delete({
      where: { id: orgId },
    });
  }
}
