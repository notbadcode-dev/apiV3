import { ILogMethod } from '@common/dtos/log-method.dto';

export class LoggingServiceTestData {
  public static getLogMethod(): ILogMethod {
    return {
      className: 'TestClass',
      methodName: 'testMethod',
      argumentList: ['arg1', 'arg2'],
      startTime: 0,
      value: (): void => {},
    };
  }

  public static getLogMethodWithValueIsUnknown(): ILogMethod {
    const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethod();
    LOG_METHOD.value = 'unknown' as unknown as () => void;

    return LOG_METHOD;
  }

  public static getLogMethodWithResult(): ILogMethod {
    const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethod();
    LOG_METHOD.result = 'Success';
    LOG_METHOD.duration = 150;

    return LOG_METHOD;
  }

  public static getLogMethodWithVoidResult(): ILogMethod {
    const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethodWithResult();
    LOG_METHOD.result = undefined;

    return LOG_METHOD;
  }

  public static getLogMethodWithError(): ILogMethod {
    const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethod();
    LOG_METHOD.error = new Error('Something went wrong');
    LOG_METHOD.duration = 100;

    return LOG_METHOD;
  }
}
