import { IGenericResponse } from "src/utils/generic";
import { FollowupDto } from "../../application/dtos/followup-glpi/followupGlpi.dto";
import { IieeDto } from "../../application/dtos/iiee.dto";
import { TicketGlpiDto } from "../../application/dtos/ticket-glpi/ticketGlpi.dto";
import { TicketGlpiFormDto } from "../../application/dtos/ticket-glpi/ticketGlpiForm.dto";
import { TicketDto } from "../../application/dtos/ticket.dto";
import { UserExternalDto } from "../../application/dtos/userExternal.dto";

export interface IGlpiApiService {
    initSessionToken(): Promise<string>;
    //createTicketWithoutFiles(ticket: TicketGlpiDto): Promise<any>;
    registerTicket(ticket: TicketGlpiFormDto, files: any[]): Promise<any>;
    uploadDocumentToGLPI(files:Express.Multer.File, ticketId: number): Promise<any>;
    assignTicketWithDocument(ticketId: number, documentId: number): Promise<any>;
    addExtraInformationToTicketById(ticketId: number, iieeRequest: IieeDto, userRequest: UserExternalDto, ticketRequest: TicketDto): Promise<any>;
    downloadDocumentById(documentId: number): Promise<any>;
    registerFollowup(ticketId: number, followupReq: FollowupDto): Promise<any>;
    updateFollowupById(followId: number, followupdto: FollowupDto): Promise<IGenericResponse<Object>>;
    listFollowupsAndSolutionsByTicketId(ticketId: number): Promise<IGenericResponse<any[]>>;
    listITILCategories(): Promise<any>;
}