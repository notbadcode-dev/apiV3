export interface IRouteMetadata {
  path: string;
  method: string;
  target: (...args: unknown[]) => unknown;
}
