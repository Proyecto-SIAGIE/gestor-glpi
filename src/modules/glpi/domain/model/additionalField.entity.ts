import { AutoMap } from "@automapper/classes";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//Esta entidad fue creada por el plugin additional fields

@Entity("glpi_plugin_fields_ticketsiagies")
export class AdditionalFieldEntity {

    @Column('int')
    @PrimaryGeneratedColumn('increment')
    @AutoMap()
    id: number;

    @AutoMap()
    @Column('int',{
        name: 'items_id'
    })
    itemsId: number;

    @AutoMap()
    @Column('varchar',{
        name: 'itemtype'
    })
    itemType: string;

    @AutoMap()
    @Column('int',{
        name: 'plugin_fields_containers_id'
    })
    pluginFieldsContainersId: number;

    @AutoMap()
    @Column('varchar',{
        name: 'dnisolicitantefield'
    })
    DNI: string;

    @AutoMap()
    @Column('varchar',{
        name: 'nombressolicitantefield'
    })
    requesterFullname: string;


    @AutoMap()
    @Column('varchar',{
        name: 'codigomodulariieefield'
    })
    modularCode: string;

    @AutoMap()
    @Column('varchar',{
        name: 'telefonofield'
    })
    phone: string;

}