import { FastifyRequest, FastifyReply } from 'fastify';

export interface CustomContext {
  request: FastifyRequest;
  reply: FastifyReply;
}
