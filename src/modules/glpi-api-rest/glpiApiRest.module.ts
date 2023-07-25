/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { GlpiApiImplService } from './application/service/glpiApiImpl.service';
import { GlpiApiController } from './infrastructure/controller/glpiApi.controller';
import { AdditionalFieldImplRepository } from '../glpi/infrastructure/repository/additionalFieldImpl.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdditionalFieldEntity } from '../glpi/domain/model/additionalField.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AdditionalFieldEntity]),
    ],
    controllers: [GlpiApiController],
    providers: [GlpiApiImplService,AdditionalFieldImplRepository],
})
export class GlpiApiRestModule { }
