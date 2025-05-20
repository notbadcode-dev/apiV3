import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { ICatchException } from '@common/interfaces/catch-exception.interface';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { Catch, ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  public catch(exception: ICatchException, host: ArgumentsHost): void {
    const CTX = host.switchToHttp();
    const CTX_RESPONSE = CTX.getResponse<Response>();

    const RESPONSE: GlobalResponseDto<null> = GlobalResponseService.getGlobalResponseAccordingException(exception);

    CTX_RESPONSE.status(exception.status).json(RESPONSE);
  }
}
