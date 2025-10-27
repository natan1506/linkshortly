import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function redirectRoutes(app: FastifyInstance) {
  app.get("/r/:code", async (request, reply) => {
    const { code } = request.params as { code: string };

    const link = await prisma.url.findUnique({ where: { code } });

    if (!link) {
      return reply.status(404).send({ message: "Link not found" });
    }
    await prisma.url.update({
      where: { code },
      data: { clicks: { increment: 1 } },
    });

    return reply.redirect(link.original);
  });
}
