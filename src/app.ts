import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { ZodError } from 'zod';
import { env } from './env';
import fastifyJwt from '@fastify/jwt';
import { petsRoutes } from './http/controllers/pets/routes';
import { orgRoutes } from './http/controllers/orgs/routes';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
});

app.register(fastifyCookie);

app.register(petsRoutes);
app.register(orgRoutes);

// to handle global errors
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TO DO: Here we should log to an external tool like datadog/newrelic/sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' });
});
