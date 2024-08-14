import { FastifyInstance } from 'fastify';
import { getPetHandler } from './get';
import { listPetsHandler } from './list';
import { verifyJWT } from '@/http/middlewares/verify-jwt';
import { registerPetHandler } from './register';

export async function petsRoutes(fastify: FastifyInstance) {
  fastify.get('/pets/:petId', getPetHandler);
  fastify.get('/pets', listPetsHandler);

  fastify.post('/pets', { preHandler: [verifyJWT] }, registerPetHandler);
}
