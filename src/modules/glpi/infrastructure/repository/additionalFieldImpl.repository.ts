import { Injectable } from "@nestjs/common";
import { iadditionalFieldRepository } from "../../domain/interface/iadditionalField.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AdditionalFieldEntity } from "../../domain/model/additionalField.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdditionalFieldImplRepository implements iadditionalFieldRepository{
    constructor(
        @InjectRepository(AdditionalFieldEntity)
        private readonly additionalFieldRepo: Repository<AdditionalFieldEntity>
    ){}
    
    async registerAdditionalInformation(addField: AdditionalFieldEntity): Promise<AdditionalFieldEntity> {
        const preload = this.additionalFieldRepo.create(addField);
        return await this.additionalFieldRepo.save(preload);
    }


}