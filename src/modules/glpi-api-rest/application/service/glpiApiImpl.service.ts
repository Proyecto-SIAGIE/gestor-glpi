/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { IGlpiApiService } from '../../domain/interface/iglpiApi.service';
import { ErrorManager } from 'src/utils/errors/error.manager';
import axios from 'axios';
import * as https from 'https';

@Injectable()
export class GlpiApiImplService implements IGlpiApiService {

    async initSessionToken(): Promise<string> {
        try {
            const requestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `user_token ${process.env.GLPI_API_TOKEN}`,
                    'App-Token': process.env.GLPI_APP_TOKEN
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            };
            const response = await axios.get(`${process.env.GLPI_APP_URL}/initSession/`, requestConfig);
            return response.data;
            
        } catch (error) {
            throw ErrorManager.createSignatureError(`BAD_REQUEST :: ${error.response.data[0]}`)
        }
    }

}
