import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should refresh the token using the refresh token cookie', async () => {
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

    // First, authenticate to get the refresh token
    const authResponse = await request(app.server).post('/sessions').send({
      email: org.email,
      password,
    });

    const cookies = authResponse.headers['set-cookie'];

    // Act: Use the refresh token to get a new token
    const refreshResponse = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send();

    // Assert
    expect(refreshResponse.statusCode).toEqual(200);
    expect(refreshResponse.body).toHaveProperty('token');
    expect(refreshResponse.headers['set-cookie']).toBeDefined();
  });
});
