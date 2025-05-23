import { ILogMethod } from '@common/dtos/log-method.dto';
import { LogPropertyDescriptorDto } from '@common/dtos/log-property-descriptor.dto';
import { LOGGING_CONSTANTS } from '@common/modules/logging/constants/logging.constants';
import { LoggingService } from '@common/modules/logging/services/logging.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function LogMethod(target: object, key: string, descriptor: PropertyDescriptor): void {
  const LOG_PROPERTY_DESCRIPTOR: LogPropertyDescriptorDto = descriptor as LogPropertyDescriptorDto;

  const LOG_METHOD: ILogMethod = {
    className: LoggingService.getClassName(target),
    methodName: key,
    argumentList: [],
    startTime: 0,
    value: LOG_PROPERTY_DESCRIPTOR.value,
  };

  const IS_FUNCTION: boolean = LoggingService.isFunction(LOG_METHOD);
  if (!IS_FUNCTION) {
    return;
  }

  const ORIGINAL_METHOD = LOG_PROPERTY_DESCRIPTOR.value;

  descriptor.value = async function (...args: unknown[]): Promise<unknown> {
    const START_TIME: number = Date.now();
    LOG_METHOD.argumentList = safeStringify(args);
    LOG_METHOD.startTime = START_TIME;

    LoggingService.logStart(LOG_METHOD);

    try {
      const RESULT: unknown = await ORIGINAL_METHOD.apply(this, args);
      LOG_METHOD.result = RESULT;
      LOG_METHOD.duration = Date.now() - START_TIME;

      LoggingService.logEnd(LOG_METHOD);

      return RESULT;
    } catch (error) {
      LOG_METHOD.error = error instanceof Error ? error : new Error(JSON.stringify(error));
      LOG_METHOD.duration = Date.now() - START_TIME;

      LoggingService.logError(LOG_METHOD);
      throw error;
    }
  };
}

function safeStringify(obj: unknown): string {
  const CACHE = new Set();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (CACHE.has(value)) return '[Circular]';
        CACHE.add(value);
      }
      return value;
    },
    LOGGING_CONSTANTS.indentObjectOnArgumentList,
  );
}
