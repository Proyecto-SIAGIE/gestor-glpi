/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { GlpiApiImplService } from '../../application/service/glpiApiImpl.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TicketGlpiDto } from '../../application/dtos/ticket-glpi/ticketGlpi.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TicketGlpiFormDto } from '../../application/dtos/ticket-glpi/ticketGlpiForm.dto';

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

    @Post('createTicketWithFiles')
    @ApiConsumes('multipart/form-data') // Indica que se acepta la carga de archivos en la solicitud
    @ApiBody({ type: TicketGlpiFormDto })
    @UseInterceptors(FilesInterceptor('files'))
    async createTicketWithFiles(@Body() ticket: TicketGlpiFormDto, @UploadedFiles() files: Express.Multer.File[]){
        //console.log(files);
        return await this.glpiService.createTicketWithFiles(ticket, files);
    }
}
