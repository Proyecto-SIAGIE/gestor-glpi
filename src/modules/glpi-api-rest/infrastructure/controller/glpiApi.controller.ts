/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { GlpiApiImplService } from '../../application/service/glpiApiImpl.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('glpi-api')
@Controller('glpi-api')
export class GlpiApiController { 
    constructor(private readonly glpiService: GlpiApiImplService){}

    @Get('initSession')
    async getInitSessionToken(){
        return await this.glpiService.initSessionToken();
    }
}
