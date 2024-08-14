import { Org } from '@prisma/client';
import { IOrgRepository } from '../repositories/org-repository';
import bcrypt from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials';

interface AuthenticateOrgRequest {
  email: string;
  password: string;
}

interface AuthenticateOrgResponse {
  org: Org;
}

export class AuthenticateOrgUseCase {
  constructor(private orgRepository: IOrgRepository) {}

  async execute(
    request: AuthenticateOrgRequest
  ): Promise<AuthenticateOrgResponse> {
    const { email, password } = request;

    // Find the ORG by email
    const org = await this.orgRepository.findByEmail(email);

    if (!org) {
      throw new InvalidCredentialsError();
    }

    // Verify the password
    const passwordMatches = await bcrypt.compare(password, org.password);

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      org,
    };
  }
}
