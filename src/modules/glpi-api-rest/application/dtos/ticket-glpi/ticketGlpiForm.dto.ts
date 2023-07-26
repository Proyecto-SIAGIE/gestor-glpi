import { ApiProperty } from "@nestjs/swagger";
import { TicketDto } from "../ticket.dto";
import { TicketDetailDto } from "../ticketDetail.dto";
import { UserExternalDto } from "../userExternal.dto";
import { IieeDto } from "../iiee.dto";

export class TicketGlpiFormDto {
    @ApiProperty({type: UserExternalDto})
    userRequest: string;
    @ApiProperty({type: TicketDto})
    ticket: string;
    @ApiProperty({type: TicketDetailDto})
    ticketDetail: string;
    @ApiProperty({type: IieeDto})
    iiee: string;

    /*@ApiProperty()
    files: Express.Multer.File[]*/
}