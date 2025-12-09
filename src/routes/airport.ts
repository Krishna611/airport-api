import express from "express";
import { param, validationResult } from "express-validator";
import NodeCache from "node-cache";
import { AppDataSource } from "../data-source";
import { Airport } from "../entities/Airport";

const router = express.Router();
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 }); // 5 minutes TTL

// GET /api/airport/:iata_code
router.get(
  "/:iata_code",
  param("iata_code")
    .isLength({ min: 3, max: 3 })
    .withMessage("IATA code must be exactly 3 characters")
    .isAlphanumeric()
    .withMessage("IATA must be alphanumeric")
    .trim()
    .toUpperCase(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const iata_code = (req.params.iata_code || "").toUpperCase();

      // caching
      const cacheKey = `airport:${iata_code}`;
      const cached = cache.get(cacheKey);
      if (cached) return res.json(cached);

      const airportRepo = AppDataSource.getRepository(Airport);

      // Defensive single-query using queryBuilder matching trimmed uppercase IATA
      const airport = await airportRepo
        .createQueryBuilder("airport")
        .leftJoinAndSelect("airport.city", "city")
        .leftJoinAndSelect("city.country", "country")
        .where("UPPER(TRIM(airport.iata_code)) = :code", { code: iata_code })
        .getOne();

      if (!airport) return res.status(404).json({ message: "Airport not found" });

      // Build response shape
      const response = {
        airport: {
          id: airport.id,
          icao_code: airport.icao_code ?? null,
          iata_code: airport.iata_code ?? null,
          name: airport.name,
          type: airport.type ?? null,
          latitude_deg: airport.latitude_deg ?? null,
          longitude_deg: airport.longitude_deg ?? null,
          elevation_ft: airport.elevation_ft ?? null,
          address: {
            city: airport.city
              ? {
                  id: airport.city.id,
                  name: airport.city.name,
                  country_id: airport.city.country_id ?? null,
                  is_active: airport.city.is_active ?? true,
                  lat: airport.city.lat ?? null,
                  long: airport.city.long ?? null,
                }
              : null,
            country: airport.city && airport.city.country
              ? {
                  id: airport.city.country.id,
                  name: airport.city.country.name,
                  country_code_two: airport.city.country.country_code_two ?? null,
                  country_code_three: airport.city.country.country_code_three ?? null,
                  mobile_code: airport.city.country.mobile_code ?? null,
                  continent_id: airport.city.country.continent_id ?? null,
                }
              : null,
          },
        },
      };

      // cache and return
      cache.set(cacheKey, response);
      return res.json(response);
    } catch (err) {
      return next(err);
    }
  }
);

export default router;
