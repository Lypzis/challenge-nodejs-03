import { FastifyRequest, FastifyReply } from 'fastify';
import { makeCreateOrgUseCase } from '@/use-cases/factories/make-create-org-use-case';
import { z } from 'zod';
import { EmailAlreadyInUseError } from '@/use-cases/errors/email-already-in-use';

export async function createOrgHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const createOrgBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    address: z.string(),
    whatsapp: z.string(),
  });

  const { name, email, password, address, whatsapp } =
    createOrgBodySchema.parse(req.body);

  const createOrgUseCase = makeCreateOrgUseCase();

  try {
    const response = await createOrgUseCase.execute({
      name,
      email,
      password,
      address,
      whatsapp,
    });

    return reply.status(201).send(response.org);
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError)
      return reply.status(409).send({ message: error.message });

    throw error;
  }
}
