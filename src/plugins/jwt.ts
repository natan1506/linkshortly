import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { env } from "../env";

export default fp(async (app) => {
  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  app.decorate("authenticate", async function (request: any, reply: any) {
    try {
      const decoded = await request.jwtVerify();
      request.user = decoded;
    } catch (err) {
      reply.send(err);
    }
  });
});
