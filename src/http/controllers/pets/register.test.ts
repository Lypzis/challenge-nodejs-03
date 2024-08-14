import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

describe('Register Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterEach(async () => {
    await prisma.pet.deleteMany();
    await prisma.org.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should allow an authenticated organization to register a pet', async () => {
    const password = 'securepassword';
    const passwordHashed = await bcrypt.hash(password, 10);

    // Arrange
    const org = await prisma.org.create({
      data: {
        name: 'Test Org',
        email: 'test@org.com',
        password: passwordHashed,
        address: '123 Test St',
        whatsapp: '123456789',
      },
    });

    // Authenticate to get the JWT token
    const authResponse = await request(app.server).post('/sessions').send({
      email: org.email,
      password,
    });

    const { token } = authResponse.body;

    console.log(token);

    // Act
    const response = await request(app.server)
      .post('/pets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Buddy',
        age: 3,
        size: 'Medium',
        color: 'Yellow',
        city: 'Test City',
      });

    // Assert
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      pet: expect.objectContaining({ name: 'Buddy' }),
    });
  });
});
