import { FastifyRequest, FastifyReply } from 'fastify';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { z } from 'zod';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials';

export async function authenticateOrgHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = authenticateBodySchema.parse(req.body);

  const authenticateOrgUseCase = makeAuthenticateUseCase();

  try {
    const { org } = await authenticateOrgUseCase.execute({ email, password });

    const token = await reply.jwtSign({}, { sign: { sub: org.id } });

    const refreshToken = await reply.jwtSign(
      {},
      { sign: { sub: org.id, expiresIn: '7d' } }
    );

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError)
      return reply.status(401).send({ error: error.message });

    throw error;
  }
}
