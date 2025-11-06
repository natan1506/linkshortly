import PrismaPkg from "@prisma/client";
const { PrismaClient } = PrismaPkg as typeof import("@prisma/client");

export const prisma = new PrismaClient();
