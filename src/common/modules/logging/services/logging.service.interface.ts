import { ILogMethod } from '@common/dtos/log-method.dto';

export interface ILoggingServiceStatic {
  getClassName(target: object): string;
  isFunction(logMethod: ILogMethod): boolean;
  logStart(logMethod: ILogMethod): void;
  logEnd(logMethod: ILogMethod): void;
  logError(logMethod: ILogMethod): void;
}
