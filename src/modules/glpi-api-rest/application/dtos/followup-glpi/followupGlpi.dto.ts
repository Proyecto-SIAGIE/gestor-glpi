import { ApiProperty } from "@nestjs/swagger";

export class FollowupDto {

    @ApiProperty()
    content: string;

    /*@ApiProperty()*/
    items_id: number;

    @ApiProperty()
    is_private: boolean;
}