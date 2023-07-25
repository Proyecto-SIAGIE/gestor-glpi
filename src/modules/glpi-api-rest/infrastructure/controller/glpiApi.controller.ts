/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post } from '@nestjs/common';
import { GlpiApiImplService } from '../../application/service/glpiApiImpl.service';
import { ApiTags } from '@nestjs/swagger';
import { TicketGlpiDto } from '../../application/dtos/ticket-glpi/ticketGlpi.dto';

@ApiTags('glpi-api')
@Controller('glpi-api')
export class GlpiApiController { 
    constructor(private readonly glpiService: GlpiApiImplService){}

    @Get('initSession')
    async getInitSessionToken(){
        return await this.glpiService.initSessionToken();
    }

    @Post('createTicket')
    async createTicketWithoutFiles(@Body() ticket: TicketGlpiDto ){
        return await this.glpiService.createTicketWithoutFiles(ticket);
    }
}
