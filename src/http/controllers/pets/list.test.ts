import request from 'supertest';
import { app } from '@/app';
import { it, describe, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { prisma } from '@/lib/prisma';

describe('List Pets (e2e)', () => {
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

  it('should be able to list pets by city', async () => {
    const { id } = await prisma.org.create({
      data: {
        name: 'Org 1',
        email: 'test@org.com',
        password: 'securepassword',
        address: '123 Test St',
        whatsapp: '123456789',
      },
    });

    await prisma.pet.createMany({
      data: [
        {
          name: 'Buddy',
          breed: 'Labrador',
          age: 3,
          size: 'Medium',
          color: 'Yellow',
          city: 'Test City',
          description: 'Friendly and playful.',
          orgId: id,
        },
        {
          name: 'Max',
          breed: 'Beagle',
          age: 2,
          size: 'Small',
          color: 'Brown',
          city: 'Test City 2',
          description: 'Energetic and loving.',
          orgId: id,
        },
      ],
    });

    // Act
    const response = await request(app.server)
      .get('/pets')
      .query({ city: 'Test City' })
      .send();

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body).toEqual({
      pets: [expect.objectContaining({ name: 'Buddy' })],
    });
  });

  it('should be able to list pets by city and breed', async () => {
    const { id } = await prisma.org.create({
      data: {
        name: 'Org 1',
        email: 'test@org.com',
        password: 'securepassword',
        address: '123 Test St',
        whatsapp: '123456789',
      },
    });

    await prisma.pet.createMany({
      data: [
        {
          name: 'Buddy',
          breed: 'Labrador',
          age: 3,
          size: 'Medium',
          color: 'Yellow',
          city: 'Test City',
          description: 'Friendly and playful.',
          orgId: id,
        },
        {
          name: 'Max',
          breed: 'Beagle',
          age: 2,
          size: 'Small',
          color: 'Brown',
          city: 'Test City',
          description: 'Energetic and loving.',
          orgId: id,
        },
      ],
    });

    // Act
    const response = await request(app.server)
      .get('/pets')
      .query({ city: 'Test City', breed: 'Beagle' })
      .send();

    // Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body.pets).toHaveLength(1);
    expect(response.body).toEqual({
      pets: [expect.objectContaining({ name: 'Max', breed: 'Beagle' })],
    });
  });

  it('should be able to list pets with pagination', async () => {
    const { id } = await prisma.org.create({
      data: {
        name: 'Org 1',
        email: 'test@org.com',
        password: 'securepassword',
        address: '123 Test St',
        whatsapp: '123456789',
      },
    });

    const pets = [];
    for (let i = 0; i < 25; i++) {
      pets.push({
        name: `Pet ${i + 1}`,
        breed: 'Breed',
        age: 1,
        size: 'Small',
        color: 'Color',
        city: 'Test City',
        description: 'Description',
        orgId: id,
      });
    }

    await prisma.pet.createMany({ data: pets });

    // Act
    const responsePage1 = await request(app.server)
      .get('/pets')
      .query({ city: 'Test City', page: 1 })
      .send();

    const responsePage2 = await request(app.server)
      .get('/pets')
      .query({ city: 'Test City', page: 2 })
      .send();

    // Assert
    expect(responsePage1.statusCode).toEqual(200);
    expect(responsePage1.body.pets).toHaveLength(20); // First page should have 20 items
    expect(responsePage2.statusCode).toEqual(200);
    expect(responsePage2.body.pets).toHaveLength(5); // Second page should have the remaining 5 items
  });
});
