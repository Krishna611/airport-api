import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { City } from "./City";

@Entity({ name: "airport" })
export class Airport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  icao_code?: string;

  @Column({ nullable: true })
  iata_code?: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ type: "float", nullable: true, name: "latitude_deg" })
  latitude_deg?: number;

  @Column({ type: "float", nullable: true, name: "longitude_deg" })
  longitude_deg?: number;

  @Column({ type: "integer", nullable: true, name: "elevation_ft" })
  elevation_ft?: number;

  @Column({ type: "integer", nullable: true })
  city_id?: number;

  @ManyToOne(() => City, (city) => city.airports, { eager: false, onDelete: "SET NULL" })
  @JoinColumn({ name: "city_id" })
  city?: City;
}
