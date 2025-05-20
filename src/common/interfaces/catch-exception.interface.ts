import { EHttpExceptionType } from '@common/enums/exception-type.enum';
import { HttpStatus } from '@nestjs/common';

export interface ICatchException {
  status: HttpStatus;
  message: string;
  name: EHttpExceptionType;
  response?: ICatchExceptionResponse;
}

export interface ICatchExceptionResponse {
  error: string;
  message: string;
  statusCode: HttpStatus;
}
