import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Fastify, { FastifyInstance } from "fastify";
import { shortenRoutes } from "../../src/routes/shorten";
import { authRoutes } from "../../src/routes/auth";
import authPlugin from "../../src/plugins/jwt";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

describe("Mains routes", () => {
  let token: string;
  let app: FastifyInstance;

  beforeAll(async () => {
    await prisma.user.deleteMany();

    app = Fastify();
    app.register(authPlugin);
    app.register(authRoutes);
    app.register(shortenRoutes);

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it("register, login and shorten flow", async () => {
    await request(app.server)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "123456" })
      .expect(201);

    const login = await request(app.server)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "123456" })
      .expect(200);
    expect(login.body).toHaveProperty("token");
    token = login.body.token;

    const res = await request(app.server)
      .post("/shorten")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "https://www.google.com" })
      .expect(200);
    expect(res.body).toHaveProperty("shortUrl");
  });
});
