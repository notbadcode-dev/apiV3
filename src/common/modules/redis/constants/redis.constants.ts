export const REDIS_CONSTANTS = {
  client: 'KeyDB',
  validValue: 'valid',
  revokedValue: 'revoked',
  expirationMeasurementWithSeconds: 'EX' as const,
  defaultExpirationInSeconds: 3600,
  defaultExpiredInSeconds: 0,
  onError: 'error',
  onConnect: 'connect',

  keys: {
    accessToken: {
      key: (userId: number): string => `access-token:${userId}`,
      expirationIn: 3600 * 24,
    },
  },

  message: {
    redisConnectionError: (error: string): string => {
      return `[REDIS] - Connection error: ${error}`;
    },
    redisConnectionSuccess: (): string => {
      return '[REDIS] - Connection established successfully.';
    },
  },
};
