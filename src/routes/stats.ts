import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function statsRoutes(app: FastifyInstance) {
  app.get(
    "/stats",
    { preHandler: [app.authenticate] },
    async (request, reply) => {
      const userId = request.user.id;

      const links = await prisma.url.findMany({
        where: { userId },
      });
      return reply.status(200).send({ links });
    }
  ),
    app.get(
      "/stats/:code",
      {
        preHandler: [app.authenticate],
        schema: {
          summary: "Retorna as estatísticas de um link encurtado",
          tags: ["links"],
          params: {
            type: "object",
            required: ["code"],
            properties: {
              code: {
                type: "string",
              },
            },
          },
          response: {
            200: {
              type: "object",
              properties: {
                original: { type: "string" },
                code: { type: "string" },
                clicks: { type: "number" },
                createdAt: { type: "string", format: "date-time" },
              },
            },
            404: {
              type: "object",
              properties: {
                message: { type: "string" },
              },
            },
          },
        },
      },
      async (request, reply) => {
        const { code } = request.params as { code: string };
        const link = await prisma.url.findUnique({
          where: { code },
        });

        if (!link) {
          reply.status(404).send({ message: "Link not found" });
        } else {
          return reply.send({
            original: link.original,
            code: link.code,
            clicks: link.clicks,
            createdAt: link.createdAt,
          });
        }
      }
    );
}
