import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

describe('Authenticate Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should authenticate an organization and return a JWT token', async () => {
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

    // Act
    const response = await request(app.server).post('/sessions').send({
      email: org.email,
      password,
    });

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('token');
    expect(response.headers['set-cookie']).toBeDefined();
  });
});
