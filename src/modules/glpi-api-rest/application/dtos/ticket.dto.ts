import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, IsInt, IsPositive } from "class-validator";
import { TicketDetailDto } from "./ticketDetail.dto";

export class TicketDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @MaxLength(500)
    @AutoMap()
    description: string;

    @ApiProperty()
    @AutoMap()
    studentDNI: string;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @AutoMap()
    categoryId: number;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @AutoMap()
    subcategory1Id: number;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @AutoMap()
    subcategory2Id: number;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @AutoMap()
    subcategory3Id: number;

    ticketDetail: TicketDetailDto;
}