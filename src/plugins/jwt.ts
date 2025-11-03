import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { env } from "../env";

export default fp(async (app) => {
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  app.decorate("authenticate", async function (request: any, reply: any) {
    try {
      await request.jwtVerify();
    } catch (err: any) {
      return reply.code(401).send({ message: "Unauthorized" });
    }
  });
});
