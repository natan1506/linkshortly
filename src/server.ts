import Fastify from "fastify";
import { env } from "./env";
import { shortenRoutes } from "./routes/shorten";
import { redirectRoutes } from "./routes/redirect";
import { setupErrorHandler } from "./error/handler";
import { statsRoutes } from "./routes/stats";
import rateLimit from "@fastify/rate-limit";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { join } from "path";
import pino from "pino";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { authRoutes } from "./routes/auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logFile = pino.destination(join(__dirname, "../logs/fastify.log"));
const app = Fastify({
  logger: {
    level: "info",
    stream: logFile,
  },
});

app.register(cors, {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
});

app.register(helmet);

app.register(rateLimit, {
  max: 10,
  timeWindow: "1 minute",
});

setupErrorHandler(app);
app.register(shortenRoutes);
app.register(redirectRoutes);
app.register(statsRoutes);
app.register(authRoutes);

const start = async () => {
  try {
    await app.listen({ port: env.PORT });
    console.log(`Server listening on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
  }
};
start();
