import { TicketGlpiDto } from "../../application/dtos/ticket-glpi/ticketGlpi.dto";
import { TicketDto } from "../../application/dtos/ticket.dto";

export interface IGlpiApiService {
    initSessionToken(): Promise<string>;
    createTicketWithoutFiles(ticket: TicketGlpiDto): Promise<any>;
}