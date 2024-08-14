import { IPetRepository } from '../repositories/pet-repository';
import { IOrgRepository } from '../repositories/org-repository';
import { Pet } from '@prisma/client';
import { ResourceDoesNotExistsError } from './errors/resource-does-not-exists';

interface GetPetDetailsRequest {
  petId: string;
}

interface GetPetDetailsResponse {
  pet: Pet;
  org: {
    name: string;
    address: string;
    whatsapp: string;
  };
}

export class GetPetDetailsUseCase {
  constructor(
    private petRepository: IPetRepository,
    private orgRepository: IOrgRepository
  ) {}

  async execute(request: GetPetDetailsRequest): Promise<GetPetDetailsResponse> {
    const { petId } = request;

    // Retrieve the pet by ID
    const pet = await this.petRepository.findById(petId);

    if (!pet) {
      throw new ResourceDoesNotExistsError();
    }

    // Retrieve the ORG by the pet's orgId
    const org = await this.orgRepository.findById(pet.orgId);

    if (!org) {
      throw new ResourceDoesNotExistsError();
    }

    return {
      pet,
      org: {
        name: org.name,
        address: org.address,
        whatsapp: org.whatsapp,
      },
    };
  }
}
