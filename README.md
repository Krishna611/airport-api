# Airport Information API (Updated)

This version includes:
- Robust CSV seeding using `csv-parse` (handles quoted fields, commas inside fields).
- Normalization of fields (trim, remove surrounding quotes, uppercase IATA).
- Defensive DB query that matches trimmed-uppercase IATA codes.
- `synchronize: true` (creates tables automatically for local dev & seeding).

## Quick start

1. Install deps:
   ```
   npm install
   ```

2. Update CSVs in `data/` or keep the sample provided.

3. Seed DB:
   ```
   npm run seed
   ```

4. Run dev server:
   ```
   npm run dev
   ```

5. Test:
   ```
   curl http://localhost:3000/api/airport/AGR
   ```

