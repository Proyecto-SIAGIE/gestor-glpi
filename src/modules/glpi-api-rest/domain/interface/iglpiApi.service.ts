import { TicketGlpiDto } from "../../application/dtos/ticket-glpi/ticketGlpi.dto";
import { TicketGlpiFormDto } from "../../application/dtos/ticket-glpi/ticketGlpiForm.dto";

export interface IGlpiApiService {
    initSessionToken(): Promise<string>;
    createTicketWithoutFiles(ticket: TicketGlpiDto): Promise<any>;
    createTicketWithFiles(ticket: TicketGlpiFormDto, files: any[]): Promise<any>;
}