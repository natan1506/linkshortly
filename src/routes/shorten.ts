import { FastifyInstance } from "fastify";
import crypto from "crypto";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const shortenSchema = z.object({
  url: z.string().url("Url not valid").max(2048, "Url too long"),
});

export async function shortenRoutes(app: FastifyInstance) {
  app.post(
    "/shorten",
    {
      preHandler: [app.authenticate],
      schema: {
        summary: "Cria um link encurtado",
        tags: ["links"],
        body: {
          type: "object",
          required: ["url"],
          properties: {
            url: {
              type: "string",
              format: "uri",
              maxLength: 2048,
            },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              shortUrl: {
                type: "string",
              },
              message: {
                type: "string",
              },
            },
          },
          500: {
            type: "object",
            properties: {
              message: {
                type: "string",
              },
            },
          },
          401: {
            type: "object",
            properties: {
              message: {
                type: "string",
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { url } = shortenSchema.parse(request.body);
      const userId = request.user.id;

      try {
        const existing = await prisma.url.findFirst({
          where: { original: url },
        });

        if (existing) {
          app.log.warn({ event: "duplicate_link", url });
          return reply.send({
            shortUrl: `http://localhost:3333/r/${existing.code}`,
            message: "Link already exists",
          });
        }

        const code = crypto.randomBytes(4).toString("hex");

        const short = await prisma.url.create({
          data: { code, original: url, userId },
        });

        app.log.info({ event: "link_created", url, code });

        return reply.send({
          shortUrl: `http://localhost:3333/r/${short.code}`,
        });
      } catch (err) {
        app.log.error({ event: "db_error", err });
        return reply.status(500).send({ message: "Internal error" });
      }
    }
  );
}
