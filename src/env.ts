import "dotenv/config";
import { jwt, z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
