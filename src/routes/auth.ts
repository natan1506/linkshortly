import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../env";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (request, reply) => {
    const bodyschema = z.object({
      email: z.string().email("E-mail not valid!"),
      password: z.string().min(6, "Password must have at least 6 characters"),
    });

    const { email, password } = bodyschema.parse(request.body);

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return reply.status(400).send({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    return reply.status(201).send({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    });
  });

  app.post("/auth/login", async (request, reply) => {
    const bodySchema = z.object({
      email: z.string().email("E-mail not valid!"),
      password: z.string(),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send({ message: "Credentials not valid!" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return reply.status(401).send({ message: "Credentials not valid!" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return reply.status(200).send({ token });
  });
}
