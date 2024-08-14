import { IPetRepository } from '../repositories/pet-repository';
import { IOrgRepository } from '../repositories/org-repository';
import { Pet } from '@prisma/client';
import { ResourceDoesNotExistsError } from './errors/resource-does-not-exists';

interface RegisterPetRequest {
  name: string;
  breed: string | null;
  age: number;
  size: string;
  color: string | null;
  city: string;
  description: string | null;
  orgId: string;
}

interface RegisterPetResponse {
  pet: Pet;
}

export class RegisterPetUseCase {
  constructor(
    private petRepository: IPetRepository,
    private orgRepository: IOrgRepository
  ) {}

  async execute(request: RegisterPetRequest): Promise<RegisterPetResponse> {
    const { name, breed, age, size, color, city, description, orgId } = request;

    const org = await this.orgRepository.findById(orgId);

    if (!org) {
      throw new ResourceDoesNotExistsError();
    }

    // Create the pet
    const pet = await this.petRepository.create({
      name,
      breed,
      age,
      size,
      color,
      city,
      description,
      orgId,
    });

    return { pet };
  }
}
