import { describe, expect, it, beforeEach } from 'vitest';
import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository';
import bcrypt from 'bcryptjs';
import { AuthenticateOrgUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials';

describe('Authenticate Org Use Case', () => {
  let authenticateOrgUseCase: AuthenticateOrgUseCase;
  let orgRepository: InMemoryOrgRepository;

  beforeEach(() => {
    orgRepository = new InMemoryOrgRepository();
    authenticateOrgUseCase = new AuthenticateOrgUseCase(orgRepository);
  });

  it('should authenticate with valid credentials', async () => {
    // Arrange
    const hashedPassword = await bcrypt.hash('securepassword', 10);

    await orgRepository.create({
      name: 'Test Org',
      email: 'test@org.com',
      password: hashedPassword,
      address: '123 Test St',
      whatsapp: '123456789',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act
    const response = await authenticateOrgUseCase.execute({
      email: 'test@org.com',
      password: 'securepassword',
    });

    // Assert
    expect(response.org.email).toBe('test@org.com');
  });

  it('should throw an error with invalid email', async () => {
    await expect(
      authenticateOrgUseCase.execute({
        email: 'nonexistent@org.com',
        password: 'securepassword',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should throw an error with invalid password', async () => {
    // Arrange
    const hashedPassword = await bcrypt.hash('securepassword', 10);

    await orgRepository.create({
      name: 'Test Org',
      email: 'test@org.com',
      password: hashedPassword,
      address: '123 Test St',
      whatsapp: '123456789',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Act & Assert
    await expect(
      authenticateOrgUseCase.execute({
        email: 'test@org.com',
        password: 'wrongpassword',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
