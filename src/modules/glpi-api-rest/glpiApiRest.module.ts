import { Module } from '@nestjs/common';
import { GlpiApiImplService } from './application/service/glpiApiImpl.service';
import { GlpiApiController } from './infrastructure/controller/glpiApi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { glpi_itilcategories } from './domain/model/glpi_itilcategories.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([glpi_itilcategories])
    ],
    controllers: [GlpiApiController],
    providers: [GlpiApiImplService],
})
export class GlpiApiRestModule { }
