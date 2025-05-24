export function getMocked<T>(instance: unknown): jest.Mocked<T> {
  return instance as jest.Mocked<T>;
}
