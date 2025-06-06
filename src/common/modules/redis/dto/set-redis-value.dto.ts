import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

import { REDIS_CONSTANTS } from '../constants/redis.constants';

export class SetRedisValueDto {
  @IsNotEmpty()
  @IsString()
  public key!: string;

  @IsNotEmpty()
  @ValidateIf((o) => typeof o.value === 'string')
  public value!: string | number | Buffer<ArrayBufferLike>;

  @IsOptional()
  @IsNumber()
  public expirationInSeconds: number = REDIS_CONSTANTS.defaultExpirationInSeconds;
}
