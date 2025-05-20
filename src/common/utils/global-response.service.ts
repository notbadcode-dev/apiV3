import { APP_CONSTANTS } from '@common/constants/app.constants';
import { HTTP_RESPONSE_MESSAGES } from '@common/constants/http.constants';
import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { HTTP_EXCEPTION_MESSAGE_TYPE } from '@common/enums/exception-type.enum';
import { EMessageType } from '@common/enums/message-type.enum';
import { ICatchException } from '@common/interfaces/catch-exception.interface';
import { HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export class GlobalResponseService {
  //#region Public Methods

  public static getSuccessfullyGlobalResponse<T = null>(data: T, message: string): GlobalResponseDto<T> {
    return {
      data: data,
      messageList: [
        {
          type: EMessageType.SUCCESSFULLY,
          message: message,
        },
      ],
    };
  }

  public static getSecurityDangerGlobalResponse(message: string, data = null): GlobalResponseDto<null> {
    return {
      data: data,
      messageList: [
        {
          type: EMessageType.DANGER,
          message: message,
        },
      ],
    };
  }

  public static getSecurityCriticalGlobalResponse(message: string, data = null): GlobalResponseDto<null> {
    return {
      data: data,
      messageList: [
        {
          type: EMessageType.CRITICAL,
          message: message,
        },
      ],
    };
  }

  public static getSecurityInformationGlobalResponse(message: string, data = null): GlobalResponseDto<null> {
    return {
      data: data,
      messageList: [
        {
          type: EMessageType.INFORMATION,
          message: message,
        },
      ],
    };
  }

  public static getSecurityWarningGlobalResponse(message: string, data = null): GlobalResponseDto<null> {
    return {
      data: data,
      messageList: [
        {
          type: EMessageType.WARNING,
          message: message,
        },
      ],
    };
  }

  public static getGlobalResponseAccordingException(exception: ICatchException): GlobalResponseDto<null> {
    const TYPE: EMessageType = HTTP_EXCEPTION_MESSAGE_TYPE[exception.name] || EMessageType.DANGER;
    const MESSAGE = this.getGlobalResponseAccordingExceptionMessage(exception);

    return {
      data: null,
      messageList: [
        {
          type: TYPE,
          message: MESSAGE,
        },
      ],
    };
  }

  //#endregion

  //#region Private Methods

  private static getGlobalResponseAccordingExceptionMessage(exception: ICatchException): string {
    const STATUS: HttpStatus = exception?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const IS_QUERY_FAILED_ERROR_EXCEPTION: boolean = exception instanceof QueryFailedError;
    if (IS_QUERY_FAILED_ERROR_EXCEPTION) {
      return APP_CONSTANTS.message.dataBaseQueryFailed();
    }

    const IS_ERROR_EXCEPTION: boolean = exception instanceof Error;
    const IS_EMPTY_MESSAGE = !exception?.message?.length;

    if (IS_ERROR_EXCEPTION && !IS_EMPTY_MESSAGE) {
      return exception.message;
    }

    return HTTP_RESPONSE_MESSAGES[STATUS];
  }

  //#endregion
}
