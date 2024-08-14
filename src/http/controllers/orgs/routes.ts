import { FastifyInstance } from 'fastify';
import { createOrgHandler } from './create';
import { authenticateOrgHandler } from './authenticate';
import { refreshHandler } from './refresh';

export async function orgRoutes(fastify: FastifyInstance) {
  fastify.post('/orgs', createOrgHandler);
  fastify.post('/sessions', authenticateOrgHandler);

  fastify.patch('/token/refresh', refreshHandler);
}
