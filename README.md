✈️ Airport Information API

A backend REST API built using Node.js, TypeScript, Express, TypeORM, and SQLite to retrieve detailed airport information using IATA codes.
It loads airport, city, and country data from CSV files and exposes a clean API endpoint.

🚀 Features

Fetch complete airport information using a single API call

TypeORM relations (Airport → City → Country)

SQLite database with auto-schema synchronization

Robust CSV importing using csv-parse

Input validation with express-validator

Automatic caching for repeated requests

Centralized error handling

Logging (morgan + winston)

Secure API with helmet + CORS enabled

📁 Project Structure
airport-api/
│
├── data/                     # CSV files (seed input)
│   ├── airports.csv
│   ├── cities.csv
│   └── countries.csv
│
├── src/
│   ├── app.ts                # Main API entry
│   ├── data-source.ts        # TypeORM datasource config
│   │
│   ├── entities/             # Database models
│   │   ├── Airport.ts
│   │   ├── City.ts
│   │   └── Country.ts
│   │
│   ├── routes/
│   │   └── airport.ts        # /api/airport/:iata_code route
│   │
│   ├── utils/
│   │   └── errors.ts         # Error middleware
│   │
│   └── seed.ts               # CSV import + DB seeding
│
├── package.json
├── tsconfig.json
├── airport.db                # Generated after seeding
└── README.md

🛠️ Tech Stack

Node.js

TypeScript

Express.js

SQLite

TypeORM

csv-parse

Node-Cache

Winston logging

Helmet security headers

📦 Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/Krishna611/airport-api.git
cd airport-api

2️⃣ Install dependencies
npm install

3️⃣ Seed the SQLite database

This reads all CSV files and inserts airport/city/country data into airport.db.

npm run seed


Expected output:

Seeding complete

4️⃣ Start the development server
npm run dev


You should see:

Server listening on port 3000

✨ API Usage
GET /api/airport/:iata_code
Example:
GET http://localhost:3000/api/airport/AGR

Sample Response:
{
  "airport": {
    "id": 145,
    "icao_code": "VIAG",
    "iata_code": "AGR",
    "name": "Agra Airport / Agra Air Force Station",
    "type": "medium_airport",
    "latitude_deg": 27.157683,
    "longitude_deg": 77.960942,
    "elevation_ft": 551,
    "address": {
      "city": {
        "id": 436,
        "name": "Agra",
        "country_id": 76,
        "is_active": true,
        "lat": 27.18,
        "long": 78.02
      },
      "country": {
        "id": 76,
        "name": "India",
        "country_code_two": "IN",
        "country_code_three": "IND",
        "mobile_code": 91,
        "continent_id": 1
      }
    }
  }
}

📝 CSV Format
airports.csv
id,icao_code,iata_code,name,type,city_id,country_id,latitude_deg,longitude_deg,elevation_ft
145,VIAG,AGR,Agra Airport / Agra Air Force Station,medium_airport,436,76,27.157683,77.960942,551

cities.csv
id,name,country_id,lat,long,is_active
436,Agra,76,27.18,78.02,true

countries.csv
id,name,country_code_two,country_code_three,mobile_code,continent_id
76,India,IN,IND,91,1

🔧 Scripts
Script	Description
npm run dev	Start server with ts-node-dev
npm run seed	Seed database from CSV
npm run build	Compile TypeScript
npm start	Run compiled JS (dist/)
🛡️ Security

This API includes:

helmet for secure HTTP headers

input validation (express-validator)

safe DB querying with TypeORM QueryBuilder

centralized exception handling

🚀 Future Enhancements

✔ Add Swagger documentation (/docs)
✔ Add search endpoints (?query=DEL)
✔ Add country/city-based airport filters
✔ Pagination for large datasets
✔ Docker support
✔ Deploy to Render/Railway

🤝 Contributing

PRs are welcome!

Fork the repo

Create your feature branch

Submit a pull request

📄 License

This project is MIT Licensed.
