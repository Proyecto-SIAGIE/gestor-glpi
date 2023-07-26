import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class IieeDto {
    @ApiProperty()
    @IsNotEmpty()
    @AutoMap()
    modularCode: string;

    @ApiProperty()
    @IsNotEmpty()
    @AutoMap()
    name: string;

}