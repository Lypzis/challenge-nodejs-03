import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';

describe('Create Org (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new organization', async () => {
    // Act
    const response = await request(app.server).post('/orgs').send({
      name: 'Test Org',
      email: 'test@org.com',
      password: 'securepassword',
      address: '123 Test St',
      whatsapp: '123456789',
    });

    // Assert
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'Test Org',
        email: 'test@org.com',
        address: '123 Test St',
        whatsapp: '123456789',
      })
    );
  });
});
