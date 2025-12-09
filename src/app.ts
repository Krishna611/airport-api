import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { AppDataSource } from "./data-source";
import airportRouter from "./routes/airport";
import { errorHandler } from "./utils/errors";
import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

async function bootstrap() {
  await AppDataSource.initialize();
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan("tiny"));

  app.use("/api/airport", airportRouter);

  app.get("/", (_req, res) => {
    res.json({ status: "ok", api: "/api/airport/:iata_code" });
  });

  // central error handler
  app.use(errorHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start app:", err);
  process.exit(1);
});
