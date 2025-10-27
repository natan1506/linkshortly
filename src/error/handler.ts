import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Validation error",
        error: error.flatten(),
      });
    }
    app.log.error(error);
    return reply.status(500).send({ message: "Internal server error" });
  });
}
