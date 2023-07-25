/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { AdditionalFieldImplRepository } from './infrastructure/repository/additionalFieldImpl.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdditionalFieldEntity } from './domain/model/additionalField.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AdditionalFieldEntity]),
    ],
    controllers: [],
    providers: [AdditionalFieldImplRepository],
})
export class GlpiModule { }
