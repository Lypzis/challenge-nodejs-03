import { describe, expect, it, beforeEach } from 'vitest';
import { GetPetDetailsUseCase } from './get-pet-details';
import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository';
import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository';
import { ResourceDoesNotExistsError } from './errors/resource-does-not-exists';

describe('Get Pet Details Use Case', () => {
  let getPetDetailsUseCase: GetPetDetailsUseCase;
  let petRepository: InMemoryPetRepository;
  let orgRepository: InMemoryOrgRepository;

  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    orgRepository = new InMemoryOrgRepository();
    getPetDetailsUseCase = new GetPetDetailsUseCase(
      petRepository,
      orgRepository
    );
  });

  it('should return pet details with org contact information', async () => {
    // Arrange
    const org = await orgRepository.create({
      name: 'Test Org',
      email: 'test@org.com',
      password: 'securepassword',
      address: '123 Test St',
      whatsapp: '123456789',
    });

    const pet = await petRepository.create({
      name: 'Buddy',
      breed: 'Labrador',
      age: 3,
      size: 'Medium',
      color: 'Yellow',
      city: 'Test City',
      description: 'Friendly and playful.',
      orgId: org.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = {
      petId: pet.id,
    };

    // Act
    const response = await getPetDetailsUseCase.execute(request);

    // Assert
    expect(response.pet).toHaveProperty('id');
    expect(response.org).toEqual({
      name: org.name,
      address: org.address,
      whatsapp: org.whatsapp,
    });
  });

  it('should throw an error if the pet does not exist', async () => {
    const request = {
      petId: 'non-existent-pet',
    };

    await expect(getPetDetailsUseCase.execute(request)).rejects.toBeInstanceOf(
      ResourceDoesNotExistsError
    );
  });

  it('should throw an error if the org does not exist', async () => {
    // Arrange
    const pet = await petRepository.create({
      name: 'Buddy',
      breed: 'Labrador',
      age: 3,
      size: 'Medium',
      color: 'Yellow',
      city: 'Test City',
      description: 'Friendly and playful.',
      orgId: 'non-existent-org',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = {
      petId: pet.id,
    };

    // Act & Assert
    await expect(getPetDetailsUseCase.execute(request)).rejects.toBeInstanceOf(
      ResourceDoesNotExistsError
    );
  });
});
