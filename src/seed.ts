import fs from "fs";
import { parse } from "csv-parse";
import { AppDataSource } from "./data-source";
import { Country } from "./entities/Country";
import { City } from "./entities/City";
import { Airport } from "./entities/Airport";

function clean(v?: string) {
  if (v === undefined || v === null) return undefined;
  const s = v.toString().trim();
  if (s === "") return undefined;
  // remove surrounding single/double quotes
  return s.replace(/^['"]|['"]$/g, "").trim();
}

async function parseCsv(filePath: string): Promise<string[][]> {
  return new Promise((resolve, reject) => {
    const rows: string[][] = [];
    if (!fs.existsSync(filePath)) return resolve(rows);
    fs.createReadStream(filePath)
      .pipe(parse({ relax_column_count: true, trim: false }))
      .on("data", (line: string[]) => {
        rows.push(line);
      })
      .on("end", () => resolve(rows))
      .on("error", (err: any) => reject(err));
  });
}

async function seed() {
  await AppDataSource.initialize();

  const countryRepo = AppDataSource.getRepository(Country);
  const cityRepo = AppDataSource.getRepository(City);
  const airportRepo = AppDataSource.getRepository(Airport);

  // clear
  await airportRepo.clear();
  await cityRepo.clear();
  await countryRepo.clear();

  // countries.csv expected header:
  // id,name,country_code_two,country_code_three,mobile_code,continent_id
  const countries = await parseCsv("data/countries.csv");
  const countriesRows = countries.slice(1); // drop header if present
  for (const r of countriesRows) {
    const [idRaw, nameRaw, code2Raw, code3Raw, mobileRaw, continentRaw] = r;
    const c = new Country();
    const id = clean(idRaw);
    if (id) c.id = parseInt(id, 10);
    c.name = clean(nameRaw) || "";
    c.country_code_two = clean(code2Raw) || undefined;
    c.country_code_three = clean(code3Raw) || undefined;
    c.mobile_code = mobileRaw ? parseInt(clean(mobileRaw) || "0", 10) : undefined;
    c.continent_id = continentRaw ? parseInt(clean(continentRaw) || "0", 10) : undefined;
    await countryRepo.save(c);
  }

  // cities.csv header:
  // id,name,country_id,lat,long,is_active
  const cities = await parseCsv("data/cities.csv");
  const citiesRows = cities.slice(1);
  for (const r of citiesRows) {
    const [idRaw, nameRaw, countryIdRaw, latRaw, longRaw, isActiveRaw] = r;
    const city = new City();
    const id = clean(idRaw);
    if (id) city.id = parseInt(id, 10);
    city.name = clean(nameRaw) || "";
    city.country_id = countryIdRaw ? parseInt(clean(countryIdRaw) || "0", 10) : undefined;
    city.lat = latRaw ? parseFloat(clean(latRaw) || "0") : undefined;
    city.long = longRaw ? parseFloat(clean(longRaw) || "0") : undefined;
    city.is_active = isActiveRaw ? clean(isActiveRaw)!.toLowerCase() !== "false" : true;
    await cityRepo.save(city);
  }

  // airports.csv header:
  // id,icao_code,iata_code,name,type,city_id,country_id,latitude_deg,longitude_deg,elevation_ft
  const airports = await parseCsv("data/airports.csv");
  const airportsRows = airports.slice(1);
  for (const r of airportsRows) {
    const [idRaw, icaoRaw, iataRaw, nameRaw, typeRaw, cityIdRaw, countryIdRaw, latRaw, lonRaw, elevRaw] = r;
    const a = new Airport();
    const id = clean(idRaw);
    if (id) a.id = parseInt(id, 10);
    a.icao_code = clean(icaoRaw) || undefined;
    a.iata_code = clean(iataRaw) ? clean(iataRaw)!.toUpperCase() : undefined;
    a.name = clean(nameRaw) || "";
    a.type = clean(typeRaw) || undefined;
    a.city_id = cityIdRaw ? parseInt(clean(cityIdRaw) || "0", 10) : undefined;
    a.latitude_deg = latRaw ? parseFloat(clean(latRaw) || "0") : undefined;
    a.longitude_deg = lonRaw ? parseFloat(clean(lonRaw) || "0") : undefined;
    a.elevation_ft = elevRaw ? parseInt(clean(elevRaw) || "0", 10) : undefined;
    await airportRepo.save(a);
  }

  console.log("Seeding complete");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
