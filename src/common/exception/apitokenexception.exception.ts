/*
https://docs.nestjs.com/exception-filters#custom-exceptions
*/

import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiTokenExceptionException extends HttpException {
  constructor() {
    super('Token suggest payment is required', HttpStatus.PAYMENT_REQUIRED);
  }
}
