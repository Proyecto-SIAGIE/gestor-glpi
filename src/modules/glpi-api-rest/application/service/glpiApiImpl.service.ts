/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { IGlpiApiService } from '../../domain/interface/iglpiApi.service';
import { ErrorManager } from 'src/utils/errors/error.manager';
import axios from 'axios';
import * as https from 'https';
import FormData from "form-data";
import { TicketGlpiDto } from '../dtos/ticket-glpi/ticketGlpi.dto';
import { convertHtmlToText } from 'src/utils/functions/utility';
import { AdditionalFieldImplRepository } from 'src/modules/glpi/infrastructure/repository/additionalFieldImpl.repository';
import { AdditionalFieldDto } from 'src/modules/glpi/application/dtos/additionalField.dto';
import { mapper } from 'src/utils/mapping/mapper';
import { AdditionalFieldEntity } from 'src/modules/glpi/domain/model/additionalField.entity';

@Injectable()
export class GlpiApiImplService implements IGlpiApiService {
    constructor(private readonly additionalFieldRepository: AdditionalFieldImplRepository) { }

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
            return response.data.session_token;

        } catch (error) {
            throw ErrorManager.createSignatureError(`BAD_REQUEST :: ${error.response.data[0]}`)
        }
    }

    async createTicketWithoutFiles(ticket: TicketGlpiDto): Promise<any> {
        try {

            const sessionToken = await this.initSessionToken();

            const requestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Token': sessionToken,
                    'App-Token': process.env.GLPI_APP_TOKEN
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            };

            const htmlDescription = `<p style="font-weight: 700; font-size: 16px;">Detalle de la consulta: </p>
            <table class="table" style="text-align-last: left;">
              <tr><th style="text-align: left;">Nombres y apellidos: </th><td>${convertHtmlToText(ticket.userRequest.name)} ${convertHtmlToText(ticket.userRequest.lastName)}</td></tr>   
              <tr><th style="text-align: left;">Correo: </th><td>${convertHtmlToText(ticket.userRequest.email)}</td></tr>
              <tr><th style="text-align: left;">Consulta: </th><td>${convertHtmlToText(ticket.ticket.description)}</td></tr>    
            </table>`;

            const ticketRequest = {
                input: {
                    name: ticket.ticketDetail.summary,
                    content: htmlDescription,
                    type: ticket.ticketDetail.type,
                    locations_id: 2,
                    itilcategories_id: (ticket.ticket.subcategory3Id !== 0) ? ticket.ticket.subcategory3Id :
                        (ticket.ticket.subcategory2Id !== 0) ? ticket.ticket.subcategory2Id :
                            (ticket.ticket.subcategory1Id !== 0) ? ticket.ticket.subcategory1Id :
                                ticket.ticket.categoryId,
                    urgency: ticket.ticketDetail.urgency,
                    impact: ticket.ticketDetail.impact,
                    priority: ticket.ticketDetail.priority,

                    requesttypes_id: ticket.ticketDetail.sourceId, //FUENTE DE SOLICITUD
                    _users_id_requester: 0,
                    _users_id_requester_notif: {
                        use_notification: 1,
                        alternative_email: [ticket.userRequest.email]
                    },
                    // _users_id_assign: 2,
                    //_users_id_assign: agent_id, //  usuario asignado
                    // _filename: obj._filename
                    //_filename: _FILENAMES
                }
            }



            //const thisForm = new FormData();
            //thisForm.append('uploadManifest', JSON.stringify(ticketRequest), { contentType: 'application/json' });


            const response = await axios.post(`${process.env.GLPI_APP_URL}/Ticket/`, ticketRequest, requestConfig);
            console.log(response.data.id);

            const additionalInfo: AdditionalFieldDto = {
                id: null,
                modularCode: null,

                itemsId: response.data.id,
                itemType: 'ticket',
                pluginFieldsContainersId: 1,
                DNI: ticket.userRequest.dni,
                phone: ticket.userRequest.phone,
                requesterFullname: `${ticket.userRequest.name} ${ticket.userRequest.lastName}`,
                studentDNI: ticket.ticket.studentDNI
            }

            const addEntity = mapper.map(additionalInfo,AdditionalFieldDto,AdditionalFieldEntity);
            console.log(addEntity)

            const result = await this.additionalFieldRepository.registerAdditionalInformation(addEntity);
            console.log(result);


            return response.data;

        } catch (error) {
            console.log(error)
            throw ErrorManager.createSignatureError(error.message)
            //throw ErrorManager.createSignatureError(`BAD_REQUEST :: ${error.response.data[0]}`)
        }
    }


}

