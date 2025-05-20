import { EMessageType } from './message-type.enum';

export enum EHttpExceptionType {
  HTTP_EXCEPTION = 'HttpException',
  BAD_REQUEST_EXCEPTION = 'BadRequestException',
  UNAUTHORIZED_EXCEPTION = 'UnauthorizedException',
  FORBIDDEN_EXCEPTION = 'ForbiddenException',
  NOT_FOUND_EXCEPTION = 'NotFoundException',
  METHOD_NOT_ALLOWED_EXCEPTION = 'MethodNotAllowedException',
  CONFLICT_EXCEPTION = 'ConflictException',
  INTERNAL_SERVER_ERROR_EXCEPTION = 'InternalServerErrorException',
  SERVICE_UNAVAILABLE_EXCEPTION = 'ServiceUnavailableException',
  GATEWAY_TIMEOUT_EXCEPTION = 'GatewayTimeoutException',
  NOT_IMPLEMENTED_EXCEPTION = 'NotImplementedException',
  QUERY_FAILED_ERROR = 'QueryFailedError',
}

export const HTTP_EXCEPTION_MESSAGE_TYPE = {
  [EHttpExceptionType.HTTP_EXCEPTION]: EMessageType.INFORMATION,
  [EHttpExceptionType.BAD_REQUEST_EXCEPTION]: EMessageType.WARNING,
  [EHttpExceptionType.UNAUTHORIZED_EXCEPTION]: EMessageType.DANGER,
  [EHttpExceptionType.FORBIDDEN_EXCEPTION]: EMessageType.DANGER,
  [EHttpExceptionType.NOT_FOUND_EXCEPTION]: EMessageType.WARNING,
  [EHttpExceptionType.METHOD_NOT_ALLOWED_EXCEPTION]: EMessageType.WARNING,
  [EHttpExceptionType.CONFLICT_EXCEPTION]: EMessageType.DANGER,
  [EHttpExceptionType.INTERNAL_SERVER_ERROR_EXCEPTION]: EMessageType.CRITICAL,
  [EHttpExceptionType.SERVICE_UNAVAILABLE_EXCEPTION]: EMessageType.CRITICAL,
  [EHttpExceptionType.GATEWAY_TIMEOUT_EXCEPTION]: EMessageType.CRITICAL,
  [EHttpExceptionType.NOT_IMPLEMENTED_EXCEPTION]: EMessageType.INFORMATION,
  [EHttpExceptionType.QUERY_FAILED_ERROR]: EMessageType.DANGER,
};
