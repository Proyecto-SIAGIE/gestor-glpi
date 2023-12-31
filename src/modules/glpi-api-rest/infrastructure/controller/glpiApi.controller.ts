/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { GlpiApiImplService } from '../../application/service/glpiApiImpl.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TicketGlpiDto } from '../../application/dtos/ticket-glpi/ticketGlpi.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TicketGlpiFormDto } from '../../application/dtos/ticket-glpi/ticketGlpiForm.dto';
import { Response } from 'express';
import { FollowupDto } from '../../application/dtos/followup-glpi/followupGlpi.dto';

@ApiTags('glpi-api')
@Controller('glpi-api')
export class GlpiApiController { 
    constructor(private readonly glpiService: GlpiApiImplService){}

    @Get('initSession')
    async getInitSessionToken(){
        return await this.glpiService.initSessionToken();
    }

    /*@Post('createTicket')
    async createTicketWithoutFiles(@Body() ticket: TicketGlpiDto ){
        return await this.glpiService.createTicketWithoutFiles(ticket);
    }*/

    @Post('tickets')
    @ApiConsumes('multipart/form-data') // Indica que se acepta la carga de archivos en la solicitud
    @ApiBody({ type: TicketGlpiFormDto })
    @UseInterceptors(FilesInterceptor('files'))
    async createTicketWithFiles(@Body() ticket: TicketGlpiFormDto, @UploadedFiles() files: Express.Multer.File[]){
        //console.log(files);
        return await this.glpiService.registerTicket(ticket, files);
    }

    @Get('document/:id/download')
    async getDownload(@Param('id', ParseIntPipe) id: number,  @Res() res: Response){
        try {
            const response = await this.glpiService.downloadDocumentById(id);
         
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', response.headers['content-disposition'].toString()); 
            res.send(response.data);
            
          } catch (error) {
          
            console.error('Error al descargar el archivo:', error);
            res.status(500).json({ error: 'Error al descargar el archivo' });
          }
    }

    @Post('tickets/:ticketId/ITILFollowups')
    async createFollowup(@Param('ticketId', ParseIntPipe) ticketId: number, @Body() followupReq: FollowupDto){
        return await this.glpiService.registerFollowup(ticketId, followupReq);
    }

    @Patch('ITILFollowups/:followupId')
    async updateFollowup(@Param('followupId', ParseIntPipe) followupId: number, @Body() followupReq: FollowupDto){
        return await this.glpiService.updateFollowupById(followupId, followupReq);
    }

    @Get('tickets/:ticketId/ITILAnswers')
    async getAnswersFromTicket(@Param('ticketId', ParseIntPipe) ticketId: number){
        return await this.glpiService.listFollowupsAndSolutionsByTicketId(ticketId);
    }

    @Get('ITILCategories')
    async getCategories(){
        return await this.glpiService.listITILCategories();
    }

}
