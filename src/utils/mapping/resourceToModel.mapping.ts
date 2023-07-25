import { AdditionalFieldDto } from "src/modules/glpi/application/dtos/additionalField.dto";
import { mapper } from "./mapper";
import { AdditionalFieldEntity } from "src/modules/glpi/domain/model/additionalField.entity";
import { createMap } from '@automapper/core';

export const resourceToModel = () => {
    createMap(mapper, AdditionalFieldDto, AdditionalFieldEntity);
}