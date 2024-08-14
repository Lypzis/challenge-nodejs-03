import { FastifyRequest, FastifyReply } from 'fastify';
import { makeGetPetDetailsUseCase } from '@/use-cases/factories/make-get-pet-details-use-case';
import { ResourceDoesNotExistsError } from '@/use-cases/errors/resource-does-not-exists';
import { z } from 'zod';

export async function getPetHandler(req: FastifyRequest, reply: FastifyReply) {
  const petParamSchema = z.object({
    petId: z.string().uuid(),
  });

  const { petId } = petParamSchema.parse(req.params);

  const getPetDetailsUseCase = makeGetPetDetailsUseCase();

  try {
    const response = await getPetDetailsUseCase.execute({ petId });

    return reply.status(200).send(response);
  } catch (error) {
    if (error instanceof ResourceDoesNotExistsError)
      return reply.status(404).send({ message: error.message });

    throw error;
  }
}
