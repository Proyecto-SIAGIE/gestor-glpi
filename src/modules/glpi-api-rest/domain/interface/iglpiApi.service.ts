import { TicketGlpiDto } from "../../application/dtos/ticket-glpi/ticketGlpi.dto";
import { TicketGlpiFormDto } from "../../application/dtos/ticket-glpi/ticketGlpiForm.dto";

export interface IGlpiApiService {
    initSessionToken(): Promise<string>;
    createTicketWithoutFiles(ticket: TicketGlpiDto): Promise<any>;
    createTicketWithFiles(ticket: TicketGlpiFormDto, files: any[]): Promise<any>;
    uploadDocument(files:Express.Multer.File, ticketId: number): Promise<any>;
    associateDocumentWithTicket(ticketId: number, documentId: number): Promise<any>;
    downloadUrl(): Promise<any>;
}