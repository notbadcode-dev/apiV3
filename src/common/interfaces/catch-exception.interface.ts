import { EHttpExceptionType } from '@common/enums/exception-type.enum';
import { HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

export interface ICatchException {
  status: HttpStatus;
  message: string;
  name: EHttpExceptionType;
  translateService: I18nService;
  response?: ICatchExceptionResponse;
}

export interface ICatchExceptionResponse {
  error: string;
  message: string;
  statusCode: HttpStatus;
}
