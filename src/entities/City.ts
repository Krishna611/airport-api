import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Country } from "./Country";
import { Airport } from "./Airport";

@Entity({ name: "city" })
export class City {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "integer", nullable: true })
  country_id?: number;

  @Column({ type: "float", nullable: true })
  lat?: number;

  @Column({ type: "float", nullable: true })
  long?: number;

  @Column({ default: true })
  is_active: boolean = true;

  @ManyToOne(() => Country, (country) => country.cities, { eager: false, onDelete: "SET NULL" })
  @JoinColumn({ name: "country_id" })
  country?: Country;

  @OneToMany(() => Airport, (airport) => airport.city)
  airports!: Airport[];
}
