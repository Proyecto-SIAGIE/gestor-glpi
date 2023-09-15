import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class glpi_itilcategories {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    entities_id: number;
    @Column()
    is_recursive: boolean;
    @Column()
    itilcategories_id: number;
    @Column()
    name: string;
    @Column()
    completename: string;
    @Column()
    comment: string;
    @Column()
    level: number;
}