import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { afterAll, beforeEach } from "vitest";
dotenv.config({ path: ".env.test" });

export const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.url.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
