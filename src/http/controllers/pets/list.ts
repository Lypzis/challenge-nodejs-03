import { FastifyRequest, FastifyReply } from 'fastify';
import { makeListPetsUseCase } from '@/use-cases/factories/make-list-pets-use-case';
import { z } from 'zod';

export async function listPetsHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const querySchema = z.object({
    city: z.string(),
    breed: z.string().optional(),
    size: z.string().optional(),
    color: z.string().optional(),
    ageMin: z.coerce.number().optional(),
    ageMax: z.coerce.number().optional(),
    page: z.coerce.number().int().default(1),
  });

  const { city, breed, size, color, ageMin, ageMax, page } = querySchema.parse(
    req.query
  );

  const listPetsUseCase = makeListPetsUseCase();

  const ageRange =
    ageMin !== undefined && ageMax !== undefined
      ? ([ageMin, ageMax] as [number, number])
      : undefined;

  try {
    const response = await listPetsUseCase.execute({
      city,
      breed,
      size,
      color,
      ageRange,
      page,
    });

    return reply.status(200).send(response);
  } catch (error) {
    throw error;
  }
}
