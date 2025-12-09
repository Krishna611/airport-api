import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { City } from "./City";

@Entity({ name: "country" })
export class Country {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  country_code_two?: string;

  @Column({ nullable: true })
  country_code_three?: string;

  @Column({ nullable: true, type: "integer" })
  mobile_code?: number;

  @Column({ nullable: true, type: "integer" })
  continent_id?: number;

  @OneToMany(() => City, (city) => city.country)
  cities!: City[];
}
