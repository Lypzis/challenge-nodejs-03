import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('Get Pet (e2e)', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to retrieve a pet', async () => {
    const org = await prisma.org.create({
      data: {
        name: 'Org 1',
        email: 'test@org.com',
        password: 'securepassword',
        address: '123 Test St',
        whatsapp: '123456789',
      },
    });

    const pet = await prisma.pet.create({
      data: {
        name: 'Buddy',
        breed: 'Labrador',
        age: 3,
        size: 'Medium',
        color: 'Yellow',
        city: 'Test City',
        description: 'Friendly and playful.',
        orgId: org.id,
      },
    });

    const profileResponse = await request(app.server)
      .get(`/pets/${pet.id}`)
      .send();

    expect(profileResponse.statusCode).toEqual(200);
    expect(profileResponse.body).toEqual({
      pet: expect.objectContaining({ name: 'Buddy' }),
      org: expect.objectContaining({ whatsapp: '123456789' }),
    });
  });
});
