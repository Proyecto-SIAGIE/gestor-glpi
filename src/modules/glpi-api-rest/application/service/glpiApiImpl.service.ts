/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { IGlpiApiService } from '../../domain/interface/iglpiApi.service';
import { ErrorManager } from 'src/utils/errors/error.manager';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as https from 'https';
import * as FormData from 'form-data';
import { TicketGlpiDto } from '../dtos/ticket-glpi/ticketGlpi.dto';
import { convertHtmlToText } from 'src/utils/functions/utility';
import { AdditionalFieldImplRepository } from 'src/modules/glpi/infrastructure/repository/additionalFieldImpl.repository';
import { AdditionalFieldDto } from 'src/modules/glpi/application/dtos/additionalField.dto';
import { mapper } from 'src/utils/mapping/mapper';
import { AdditionalFieldEntity } from 'src/modules/glpi/domain/model/additionalField.entity';
import { UserExternalDto } from '../dtos/userExternal.dto';
import { TicketDto } from '../dtos/ticket.dto';
import { TicketDetailDto } from '../dtos/ticketDetail.dto';
import { IieeDto } from '../dtos/iiee.dto';
import { TicketGlpiFormDto } from '../dtos/ticket-glpi/ticketGlpiForm.dto';


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
            console.log(error);
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


            const {data} = await axios.post(`${process.env.GLPI_APP_URL}/Ticket/`, ticketRequest, requestConfig);
            //console.log(response.data.id);

            const additionalInfo: AdditionalFieldDto = {
                modularCode: ticket.iiee.modularCode,
                itemsId: data.id,
                itemType: 'ticket',
                pluginFieldsContainersId: 1,
                DNI: ticket.userRequest.dni,
                phone: ticket.userRequest.phone,
                requesterFullname: `${ticket.userRequest.name} ${ticket.userRequest.lastName}`,
                studentDNI: ticket.ticket.studentDNI
            }

            const addEntity = mapper.map(additionalInfo,AdditionalFieldDto,AdditionalFieldEntity);
            await this.additionalFieldRepository.registerAdditionalInformation(addEntity);
            return data;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message)
            //throw ErrorManager.createSignatureError(`BAD_REQUEST :: ${error.response.data[0]}`)
        }
    }

    /*async createTicketWithFilesE(ticketGlpi: TicketGlpiFormDto, files: any[]): Promise<any> {
        try {

            const sessionToken = await this.initSessionToken();

            const userRequest: UserExternalDto = JSON.parse(ticketGlpi.userRequest);
            const ticketRequest: TicketDto = JSON.parse(ticketGlpi.ticket);
            const ticketDetailRequest: TicketDetailDto = JSON.parse(ticketGlpi.ticketDetail);
            const iieeRequest: IieeDto = JSON.parse(ticketGlpi.iiee);

            const requestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Session-Token': sessionToken,
                    'App-Token': process.env.GLPI_APP_TOKEN
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            };

            //console.log(files);

        
            const ticketFormatToGLPI = {
                input: {
                    name: ticketDetailRequest.summary,
                    content: ticketRequest.description,
                    type: ticketDetailRequest.type,
                    locations_id: 2,
                    itilcategories_id: (ticketRequest.subcategory3Id !== 0) ? ticketRequest.subcategory3Id :
                        (ticketRequest.subcategory2Id !== 0) ? ticketRequest.subcategory2Id :
                            (ticketRequest.subcategory1Id !== 0) ? ticketRequest.subcategory1Id :
                            ticketRequest.categoryId,
                    urgency: ticketDetailRequest.urgency,
                    impact: ticketDetailRequest.impact,
                    priority: ticketDetailRequest.priority,

                    requesttypes_id: ticketDetailRequest.sourceId, //FUENTE DE SOLICITUD
                    _users_id_requester: 0,
                    _users_id_requester_notif: {
                        use_notification: 1,
                        alternative_email: [userRequest.email]
                    },
                    // _users_id_assign: 2,
                    //_users_id_assign: agent_id, //  usuario asignado
                    // _filename: obj._filename
                    _filename: files.map((item) => item.originalname)
                }
            }

            console.log(ticketFormatToGLPI);
            console.log('----')

            const thisForm = new FormData();
            thisForm.append('uploadManifest', JSON.stringify(ticketFormatToGLPI), { contentType: 'application/json' });
            
            for (let i = 0; i < files.length; i++) {
                const el = files[i];
                thisForm.append(`file${i}`, el.buffer, el.originalname);
            }

            //const response = {data: {id: 3}}
            console.log(thisForm);
            const response = await axios.post(`${process.env.GLPI_APP_URL}/Ticket/`, thisForm, requestConfig);
      
            const {status, statusText, data} = response;
            console.log({
                'status': status,
                'statusText': statusText,
                'data': data
            })
            //console.log(response.data.id);

            const extraInfo: AdditionalFieldDto = {
                modularCode: iieeRequest.modularCode,
                itemsId: response.data.id,
                itemType: 'ticket',
                pluginFieldsContainersId: 3,
                DNI: userRequest.dni,
                phone: userRequest.phone,
                requesterFullname: `${userRequest.name} ${userRequest.lastName}`,
                studentDNI: ticketRequest.studentDNI
            }

            const addEntity = mapper.map(extraInfo,AdditionalFieldDto,AdditionalFieldEntity);
            await this.additionalFieldRepository.registerAdditionalInformation(addEntity);

            return response.data;
        } catch (error) {
            console.log(error)
            throw ErrorManager.createSignatureError(error.message)
            //throw ErrorManager.createSignatureError(`BAD_REQUEST :: ${error.response.data[0]}`)
        }
    }*/

    async createTicketWithFiles(ticketGlpi: TicketGlpiFormDto, files: Express.Multer.File[]): Promise<any> {

        try{
            const sessionToken = await this.initSessionToken();

            const userRequest: UserExternalDto = JSON.parse(ticketGlpi.userRequest);
            const ticketRequest: TicketDto = JSON.parse(ticketGlpi.ticket);
            const ticketDetailRequest: TicketDetailDto = JSON.parse(ticketGlpi.ticketDetail);
            const iieeRequest: IieeDto = JSON.parse(ticketGlpi.iiee);
    
            const requestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Session-Token': sessionToken,
                    'App-Token': process.env.GLPI_APP_TOKEN
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            };
    
            const ticketFormatToGLPI = {
                input: {
                    name: ticketDetailRequest.summary,
                    content: ticketRequest.description,
                    type: ticketDetailRequest.type,
                    locations_id: 2,
                    itilcategories_id: (ticketRequest.subcategory3Id !== 0) ? ticketRequest.subcategory3Id :
                        (ticketRequest.subcategory2Id !== 0) ? ticketRequest.subcategory2Id :
                            (ticketRequest.subcategory1Id !== 0) ? ticketRequest.subcategory1Id :
                            ticketRequest.categoryId,
                    urgency: ticketDetailRequest.urgency,
                    impact: ticketDetailRequest.impact,
                    priority: ticketDetailRequest.priority,
    
                    requesttypes_id: ticketDetailRequest.sourceId, //FUENTE DE SOLICITUD
                    _users_id_requester: 0,
                    _users_id_requester_notif: {
                        use_notification: 1,
                        alternative_email: [userRequest.email]
                    },
                }
            }

            const thisForm = new FormData();
            thisForm.append('uploadManifest', JSON.stringify(ticketFormatToGLPI), { contentType: 'application/json' });
    
            const {data} = await axios.post(`${process.env.GLPI_APP_URL}/Ticket/`, thisForm, requestConfig);
            
            
            for (let i = 0; i < files.length; i++) {
                const el = files[i];
    
                const {id: documentId} = await this.uploadDocumentToGLPI(el,data.id);
                //console.log(documentId);
                await this.assignTicketWithDocument(data.id,documentId);
            }

            const addFieldEntity = await this.addExtraInformationToTicketById(data.id,iieeRequest,userRequest,ticketRequest);
            if(!addFieldEntity){
                throw new ErrorManager({
                    type: 'BAD_REQUEST',
                    message: `Probably the 'pluginFieldsContainersId' is wrong or the GLPI 
                    AdditionalField plugin was not configured`
                })
            }
            //console.log(data.id)

            

            return data;
        }
        catch(error){
            //console.log(error)
            throw ErrorManager.createSignatureError(error.message);
        }
        
    }

    async addExtraInformationToTicketById(ticketId: number, 
        iieeRequest: IieeDto, 
        userRequest: UserExternalDto, 
        ticketRequest: TicketDto): Promise<any> {
        try{

            const extraInfo: AdditionalFieldDto = {
                modularCode: iieeRequest.modularCode,
                itemsId: ticketId,
                itemType: 'ticket',
                pluginFieldsContainersId: 3,
                DNI: userRequest.dni,
                phone: userRequest.phone,
                requesterFullname: `${userRequest.name} ${userRequest.lastName}`,
                studentDNI: ticketRequest.studentDNI
            }

            ///console.log(extraInfo)

            const addEntity = mapper.map(extraInfo,AdditionalFieldDto,AdditionalFieldEntity);
            return await this.additionalFieldRepository.registerAdditionalInformation(addEntity);

        }catch(error){
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    async uploadDocumentToGLPI(file: Express.Multer.File, ticketId: number): Promise<any> {
        try{
            const sessionToken = await this.initSessionToken();

            const requestConfig = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Session-Token': sessionToken,
                    'App-Token': process.env.GLPI_APP_TOKEN
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            };

            const uploadManifest = {
                input: {
                    name: file.originalname.replace(/\.[^.]*$/, ""),
                    items_id: ticketId,
                    _filename: [file.originalname]
                }
            }

            

            const thisForm = new FormData();
            thisForm.append('uploadManifest', JSON.stringify(uploadManifest), { contentType: 'application/json' });

            thisForm.append(`filename[]`, file.buffer, file.originalname);

            const response = await axios.post(`${process.env.GLPI_APP_URL}/document/`, thisForm, requestConfig);
            console.log(response.data);

            return response.data;
        }catch(error){
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    async assignTicketWithDocument(ticketId: number, documentId: number): Promise<any>{
        try{
            const sessionToken = await this.initSessionToken();

            const requestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Token': sessionToken,
                    'App-Token': process.env.GLPI_APP_TOKEN
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
            };

            const documentItem = {
                input: {
                    items_id: ticketId,
                    itemtype: "Ticket",
                    documents_id: documentId,
                    users_id: 2
                }
            }

            await axios.post(`${process.env.GLPI_APP_URL}/Document_Item/`, documentItem, requestConfig);
       
        }catch(error){
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    async downloadDocumentById(documentId: number): Promise<AxiosResponse>{
        try{
            const sessionToken = await this.initSessionToken();

            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Session-Token': sessionToken,
                    'App-Token': process.env.GLPI_APP_TOKEN
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false }),
                responseType:'arraybuffer'
            };

            const resp = await axios.get(`${process.env.GLPI_APP_URL}/Document/${documentId}?alt=media`, requestConfig);
            return resp;

        }catch(error){
            throw ErrorManager.createSignatureError(error.message);
        }
    }
}

