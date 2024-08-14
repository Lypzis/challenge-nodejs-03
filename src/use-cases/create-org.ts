import { IOrgRepository } from '../repositories/org-repository';
import bcrypt from 'bcryptjs';
import { Org } from '@prisma/client';
import { EmailAlreadyInUseError } from './errors/email-already-in-use';

interface CreateOrgRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  whatsapp: string;
}

interface CreateOrgResponse {
  org: Org;
}

export class CreateOrgUseCase {
  constructor(private orgRepository: IOrgRepository) {}

  async execute(request: CreateOrgRequest): Promise<CreateOrgResponse> {
    const { name, email, password, address, whatsapp } = request;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if an ORG with the same email already exists
    const existingOrg = await this.orgRepository.findByEmail(email);

    if (existingOrg) {
      throw new EmailAlreadyInUseError();
    }

    // Create the ORG in the repository
    const org = await this.orgRepository.create({
      name,
      email,
      password: hashedPassword,
      address,
      whatsapp,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      org,
    };
  }
}
