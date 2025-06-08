import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { ICatchException } from '@common/interfaces/catch-exception.interface';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly _i18nService: I18nService<Record<string, unknown>>) {}

  public catch(exception: ICatchException, host: ArgumentsHost): void {
    const CTX = host.switchToHttp();
    const CTX_RESPONSE = CTX.getResponse<Response>();

    exception.translateService = this._i18nService;

    const RESPONSE: GlobalResponseDto<null> = GlobalResponseService.getGlobalResponseAccordingException(exception);

    CTX_RESPONSE.status(exception.status).json(RESPONSE);
  }
}
