import { FastifyRequest, FastifyReply } from 'fastify';
import { makeRegisterPetUseCase } from '@/use-cases/factories/make-register-pet-use-case';
import { z } from 'zod';

export async function registerPetHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const registerPetBodySchema = z.object({
    name: z.string(),
    breed: z.string().optional(),
    age: z.coerce.number().int().nonnegative(),
    size: z.string(),
    color: z.string().optional(),
    city: z.string(),
    description: z.string().optional(),
  });

  const { name, breed, age, size, color, city, description } =
    registerPetBodySchema.parse(req.body);

  const registerPetUseCase = makeRegisterPetUseCase();

  try {
    const pet = await registerPetUseCase.execute({
      name,
      breed: breed || null, // Handle undefined by assigning null
      age,
      size,
      color: color || null, // Handle undefined by assigning null
      city,
      description: description || null, // Handle undefined by assigning null
      orgId: req.user.sub, // Assuming the orgId is stored in the JWT subject (sub)
    });

    return reply.status(201).send(pet);
  } catch (error) {
    console.log(error);
    return reply.status(400).send({ error: 'Could not register the pet.' });
  }
}
