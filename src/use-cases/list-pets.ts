import { IPetRepository } from '../repositories/pet-repository';
import { Pet } from '@prisma/client';

interface ListPetsRequest {
  city: string; // mandatory
  breed?: string;
  size?: string;
  color?: string;
  ageRange?: [number, number];
  page?: number;
}

interface ListPetsResponse {
  pets: Pet[];
}

export class ListPetsUseCase {
  constructor(private petRepository: IPetRepository) {}

  async execute(request: ListPetsRequest): Promise<ListPetsResponse> {
    const {
      city,
      breed,
      size,
      color,
      ageRange,
      page = 1, // Default to page 1 if not provided
    } = request;

    const filters = {
      city,
      breed,
      size,
      color,
      ageRange,
    };

    const pets = await this.petRepository.listAll(filters, page);

    return { pets };
  }
}
