/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { GlpiApiImplService } from './application/service/glpiApiImpl.service';
import { GlpiApiController } from './infrastructure/controller/glpiApi.controller';

@Module({
    imports: [],
    controllers: [GlpiApiController],
    providers: [GlpiApiImplService],
})
export class GlpiApiRestModule { }
