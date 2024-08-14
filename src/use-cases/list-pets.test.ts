import { describe, expect, it, beforeEach } from 'vitest';
import { ListPetsUseCase } from './list-pets';
import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository';

describe('List Pets Use Case', () => {
  let listPetsUseCase: ListPetsUseCase;
  let petRepository: InMemoryPetRepository;

  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    listPetsUseCase = new ListPetsUseCase(petRepository);
  });

  it('should list all pets in the specified city', async () => {
    // Arrange
    await petRepository.create({
      name: 'Buddy',
      breed: 'Labrador',
      age: 3,
      size: 'Medium',
      color: 'Yellow',
      city: 'Test City',
      description: 'Friendly and playful.',
      orgId: 'org-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await petRepository.create({
      name: 'Max',
      breed: 'Beagle',
      age: 2,
      size: 'Small',
      color: 'Brown',
      city: 'Test City',
      description: 'Energetic and loving.',
      orgId: 'org-2',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = {
      city: 'Test City',
    };

    // Act
    const response = await listPetsUseCase.execute(request);

    // Assert
    expect(response.pets).toHaveLength(2);
    expect(response.pets).toEqual([
      expect.objectContaining({ name: 'Buddy' }),
      expect.objectContaining({ name: 'Max' }),
    ]);
  });

  it('should filter pets by breed and size', async () => {
    // Arrange
    await petRepository.create({
      name: 'Buddy',
      breed: 'Labrador',
      age: 3,
      size: 'Medium',
      color: 'Yellow',
      city: 'Test City',
      description: 'Friendly and playful.',
      orgId: 'org-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await petRepository.create({
      name: 'Max',
      breed: 'Beagle',
      age: 2,
      size: 'Small',
      color: 'Brown',
      city: 'Test City',
      description: 'Energetic and loving.',
      orgId: 'org-2',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const request = {
      city: 'Test City',
      breed: 'Beagle',
      size: 'Small',
    };

    // Act
    const response = await listPetsUseCase.execute(request);

    // Assert
    expect(response.pets).toHaveLength(1);
    expect(response.pets).toEqual([expect.objectContaining({ name: 'Max' })]);
  });

  it('should paginate results', async () => {
    // Arrange
    const pets = [];

    for (let i = 0; i < 25; i++) {
      pets.push({
        id: `pet-${i + 1}`,
        name: `Pet ${i + 1}`,
        breed: 'Breed',
        age: 1,
        size: 'Small',
        color: 'Color',
        city: 'Test City',
        description: 'Description',
        orgId: `org-${i + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    for (const pet of pets) {
      await petRepository.create(pet);
    }

    const requestPage1 = {
      city: 'Test City',
      page: 1,
    };

    const requestPage2 = {
      city: 'Test City',
      page: 2,
    };

    // Act
    const responsePage1 = await listPetsUseCase.execute(requestPage1);
    const responsePage2 = await listPetsUseCase.execute(requestPage2);

    // Assert
    expect(responsePage1.pets).toHaveLength(20); // First page should have 20 items
    expect(responsePage2.pets).toHaveLength(5); // Second page should have the remaining 5 items
  });
});
