import { AutoMap } from "@automapper/classes";


export class AdditionalFieldDto  {
    @AutoMap()
    id?: number;

    @AutoMap()
    itemsId: number;

    @AutoMap()
    itemType: string;

    @AutoMap()
    pluginFieldsContainersId: number;

    @AutoMap()
    DNI: string;

    @AutoMap()
    requesterFullname: string;

    @AutoMap()
    studentDNI: string;

    @AutoMap()
    modularCode: string;

    @AutoMap()
    phone: string;
}

