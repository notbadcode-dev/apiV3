import { ILogMethod } from '@common/dtos/log-method.dto';
import { LOGGING_CONSTANTS } from '@common/modules/logging/constants/logging.constants';
import { LOGGER } from '@common/modules/logging/services/logger.service';

import { ILoggingServiceStatic } from './logging.service.interface';

export class LoggingService {
  public static getClassName(target: object): string {
    return target?.constructor?.name ?? '';
  }

  public static isFunction(logMethod: ILogMethod): boolean {
    const IS_FUNCTION: boolean = typeof logMethod.value === LOGGING_CONSTANTS.functionName;
    if (!IS_FUNCTION) {
      LOGGER.error(`${LOGGING_CONSTANTS.isNotAFunctionMessage(logMethod)}`);
    }

    return IS_FUNCTION;
  }

  public static logStart(logMethod: ILogMethod): void {
    LOGGER.info(`${LOGGING_CONSTANTS.logStart(logMethod)}`);
  }

  public static logEnd(logMethod: ILogMethod): void {
    LOGGER.info(`${LOGGING_CONSTANTS.logEnd(logMethod)}`);
  }

  public static logError(logMethod: ILogMethod): void {
    LOGGER.error(`${LOGGING_CONSTANTS.logError(logMethod)}`);
  }

  public static logInfoMessage(message: string): void {
    LOGGER.info(message);
  }

  public static logErrorMessage(message: string): void {
    LOGGER.error(message);
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention, no-unused-vars, @typescript-eslint/no-unused-vars
const _loggingServiceContract: ILoggingServiceStatic = LoggingService;
