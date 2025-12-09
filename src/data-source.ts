import "reflect-metadata";
import { DataSource } from "typeorm";
import { Airport } from "./entities/Airport";
import { City } from "./entities/City";
import { Country } from "./entities/Country";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.SQLITE_DB || "airport.db",
  synchronize: true, // enabled for local dev/seeding; disable in production
  logging: false,
  entities: [Airport, City, Country],
});
