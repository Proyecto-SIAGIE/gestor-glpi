import { ApiProperty } from "@nestjs/swagger";
import { TicketDto } from "../ticket.dto";
import { TicketDetailDto } from "../ticketDetail.dto";
import { UserExternalDto } from "../userExternal.dto";

export class TicketGlpiDto {
    @ApiProperty()
    userRequest: UserExternalDto;
    @ApiProperty()
    ticket: TicketDto;
    @ApiProperty()
    ticketDetail: TicketDetailDto;
}