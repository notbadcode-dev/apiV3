export interface ILogMethod {
  className: string;
  methodName: string;
  argumentList: unknown[] | string;
  startTime: number;
  result?: unknown;
  error?: Error;
  duration?: number;
  value?: unknown;
}
