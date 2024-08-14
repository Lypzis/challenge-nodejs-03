import { describe, expect, it, beforeEach } from 'vitest';
import { RegisterPetUseCase } from './register-pet';
import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository';
import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository';
import { ResourceDoesNotExistsError } from './errors/resource-does-not-exists';

describe('Register Pe tUse Case', () => {
  let registerPetUseCase: RegisterPetUseCase;
  let petRepository: InMemoryPetRepository;
  let orgRepository: InMemoryOrgRepository;

  beforeEach(() => {
    petRepository = new InMemoryPetRepository();
    orgRepository = new InMemoryOrgRepository();
    registerPetUseCase = new RegisterPetUseCase(petRepository, orgRepository);
  });

  it('should register a pet successfully', async () => {
    // Arrange
    const org = await orgRepository.create({
      name: 'Test Org',
      email: 'test@org.com',
      password: 'securepassword',
      address: '123 Test St',
      whatsapp: '123456789',
    });

    const request = {
      name: 'Buddy',
      breed: 'Labrador',
      age: 3,
      size: 'Medium',
      color: 'Yellow',
      city: 'Test City',
      description: 'Friendly and playful.',
      orgId: org.id,
    };

    // Act
    const response = await registerPetUseCase.execute(request);

    // Assert
    expect(response.pet).toHaveProperty('id');
    expect(response.pet.name).toBe('Buddy');
    expect(response.pet.orgId).toBe(org.id);
  });

  it('should throw an error if the organization does not exist', async () => {
    const request = {
      name: 'Buddy',
      breed: 'Labrador',
      age: 3,
      size: 'Medium',
      color: 'Yellow',
      city: 'Test City',
      description: 'Friendly and playful.',
      orgId: 'non-existent-org',
    };

    await expect(registerPetUseCase.execute(request)).rejects.toBeInstanceOf(
      ResourceDoesNotExistsError
    );
  });
});
