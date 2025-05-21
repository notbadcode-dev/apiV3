import { ILogMethod } from '@common/dtos/log-method.dto';

export const LOGGING_CONSTANTS = {
  functionName: 'function',

  isNotAFunctionMessage: (logMethod: ILogMethod): string => {
    return `${logMethod.className}: The property ${logMethod.methodName} is not a function.`;
  },

  logStart: (logMethod: ILogMethod): string => {
    if (logMethod.argumentList.length > 0) {
      return LOGGING_CONSTANTS.getLogWithArguments(logMethod);
    }

    return LOGGING_CONSTANTS.getLogWithoutArguments(logMethod);
  },

  getLogWithArguments: (logMethod: ILogMethod): string => {
    return `${logMethod.className}: Starting ${logMethod.methodName} with arguments: ${JSON.stringify(logMethod.argumentList)}.`;
  },

  getLogWithoutArguments: (logMethod: ILogMethod): string => {
    return `${logMethod.className}: Starting ${logMethod.methodName} without arguments.`;
  },

  logEnd: (logMethod: ILogMethod): string => {
    if (logMethod.result === undefined) {
      return LOGGING_CONSTANTS.getLogWithVoidResult(logMethod);
    }

    return LOGGING_CONSTANTS.getLogWithResult(logMethod);
  },

  getLogWithResult: (logMethod: ILogMethod): string => {
    const DURATION = logMethod.duration ?? 0;
    return `${logMethod.className}: Finished ${logMethod.methodName} in ${DURATION}ms with result: ${JSON.stringify(logMethod.result)}.`;
  },

  getLogWithVoidResult: (logMethod: ILogMethod): string => {
    const DURATION = logMethod.duration ?? 0;
    return `${logMethod.className}: Finished ${logMethod.methodName} in ${DURATION}ms with result: void.`;
  },

  logError: (logMethod: ILogMethod): string => {
    const DURATION = logMethod.duration ?? 0;
    return `${logMethod.className}: Method ${logMethod.methodName} failed after ${DURATION}ms with error: ${logMethod.error?.message}.`;
  },

  getLogFileName: (): string => {
    const CURRENT_DATE = new Date();
    const CURRENT_DAY = CURRENT_DATE.getDate().toString().padStart(2, '0');
    const CURRENT_MONTH = (CURRENT_DATE.getMonth() + 1).toString().padStart(2, '0');
    const CURRENT_YEAR = CURRENT_DATE.getFullYear();
    return `logs/notbadcode-api-${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DAY}.log`;
  },

  getLogMaxSize: (): number => {
    return 10 * 1024 * 1024;
  },

  getLogMaxFiles: 5,

  loggerLevel: 'info' as const,

  indentObjectOnArgumentList: 2,
};
