import { HttpException, HttpStatus } from "@nestjs/common";

export class ErrorManager extends Error {
    constructor({ type, message }: { type: keyof typeof HttpStatus, message: string }) {
        super(`${type} :: ${message}`)
    }

    public static createSignatureError(message: string) {

        const [name, onlyMessage] = message.includes('::') ? message.split(" :: ") : ['', message];
        const statusCode = name !== '' ? HttpStatus[name] : HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(onlyMessage, statusCode);
      
    }
}