import { APP_CONSTANTS } from '@common/constants/app.constants';
import { SYMBOL_CONSTANTS } from '@common/constants/symbol.constants';
import { RequestMetadataDto } from '@common/dtos/request-metadata.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

function extractApplicationId(headers: Record<string, unknown>): number {
  const HEADER_KEY = APP_CONSTANTS.configuration.httpHeader.applicationId;
  const RAW_VALUE = headers?.[HEADER_KEY];

  const PARSED = Number(RAW_VALUE?.toString());
  return Number.isNaN(PARSED) ? 0 : PARSED;
}

function extractUserAgent(headers: Record<string, unknown>): string {
  return (headers?.[APP_CONSTANTS.configuration.httpHeader.useragent] as string) ?? 'unknown';
}

function extractIpAddress(request: Request): string {
  const FORWARDED_FOR = request?.headers?.[APP_CONSTANTS.configuration.httpHeader.forwardedFor];

  if (typeof FORWARDED_FOR === 'string') {
    return FORWARDED_FOR.split(SYMBOL_CONSTANTS.comma)[0].trim();
  }

  return request.socket.remoteAddress ?? APP_CONSTANTS.configuration.httpHeader.defaultHeaderValue;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RequestMetadata = createParamDecorator((data: unknown, ctx: ExecutionContext): RequestMetadataDto => {
  const REQUEST = ctx.switchToHttp().getRequest<Request>();
  const HEADERS = REQUEST.headers;

  return {
    applicationId: extractApplicationId(HEADERS),
    userAgent: extractUserAgent(HEADERS),
    ipAddress: extractIpAddress(REQUEST),
  };
});
