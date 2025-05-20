export interface IRedisService {
  setAccessToken(userId: number, value: string | number | Buffer<ArrayBufferLike>): Promise<void>;

  getAccessToken(userId: number): Promise<string | null>;

  expireAccessToken(userId: number): Promise<boolean>;
}
