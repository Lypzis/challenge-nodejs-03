import { Org, Prisma } from '@prisma/client';
import { IOrgRepository } from '../org-repository';
import { randomUUID } from 'node:crypto';

export class InMemoryOrgRepository implements IOrgRepository {
  private orgs: Org[] = [];

  async create(orgData: Prisma.OrgUncheckedCreateInput): Promise<Org> {
    const org = { ...orgData, id: randomUUID() };
    this.orgs.push(org as Org);
    return org as Org;
  }

  async findById(orgId: string): Promise<Org | null> {
    return this.orgs.find(org => org.id === orgId) || null;
  }

  async findByEmail(email: string): Promise<Org | null> {
    return this.orgs.find(org => org.email === email) || null;
  }

  async update(org: Org): Promise<Org> {
    const index = this.orgs.findIndex(o => o.id === org.id);

    if (index !== -1) {
      this.orgs[index] = org;
    }

    return org;
  }

  async delete(orgId: string): Promise<void> {
    this.orgs = this.orgs.filter(org => org.id !== orgId);
  }
}
