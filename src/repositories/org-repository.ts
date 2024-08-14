import { Prisma, Org } from '@prisma/client';

export interface IOrgRepository {
  // Create a new ORG
  create(orgData: Prisma.OrgUncheckedCreateInput): Promise<Org>;

  // Find an ORG by its ID
  findById(orgId: string): Promise<Org | null>;

  // Find an ORG by its email (used for authentication)
  findByEmail(email: string): Promise<Org | null>;

  // Update an ORG's information
  update(org: Org): Promise<Org>;

  // Delete an ORG by its ID
  delete(orgId: string): Promise<void>;
}
