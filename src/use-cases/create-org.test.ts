import { describe, expect, it, beforeEach } from 'vitest';
import { CreateOrgUseCase } from './create-org';
import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository';
import { EmailAlreadyInUseError } from './errors/email-already-in-use';

describe('Create Org Use Case', () => {
  let createOrgUseCase: CreateOrgUseCase;
  let orgRepository: InMemoryOrgRepository;

  beforeEach(() => {
    orgRepository = new InMemoryOrgRepository();
    createOrgUseCase = new CreateOrgUseCase(orgRepository);
  });

  it('should create a new org', async () => {
    // Act
    const response = await createOrgUseCase.execute({
      name: 'Test Org',
      email: 'test@org.com',
      password: 'securepassword',
      address: '123 Test St',
      whatsapp: '123456789',
    });

    // Assert
    expect(response.org).toHaveProperty('id');
  });

  it('should not allow creation of org with the same email', async () => {
    // Arrange
    await createOrgUseCase.execute({
      name: 'Org 1',
      email: 'test@org.com',
      password: 'securepassword',
      address: '123 Test St',
      whatsapp: '123456789',
    });

    // Act & Assert
    await expect(
      createOrgUseCase.execute({
        name: 'Org 2',
        email: 'test@org.com',
        password: 'anotherpassword',
        address: '456 Another St',
        whatsapp: '987654321',
      })
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });
});
