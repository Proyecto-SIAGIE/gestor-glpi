import { TicketGlpiDto } from "src/modules/glpi-api-rest/application/dtos/ticket-glpi/ticketGlpi.dto";
import { AdditionalFieldEntity } from "../model/additionalField.entity";

export interface iadditionalFieldRepository {
    registerAdditionalInformation(addField: AdditionalFieldEntity): Promise<AdditionalFieldEntity>;
}