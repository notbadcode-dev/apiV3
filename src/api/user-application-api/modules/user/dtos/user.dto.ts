import { Expose } from 'class-transformer';
import { IsEmail, IsInt, IsString, Length } from 'class-validator';

import { USER_CONSTANTS } from '../constants/user.constants';

export class UserDto {
  @Expose()
  @IsInt()
  public id!: number;

  @Expose()
  @IsEmail()
  public email!: string;

  @Expose()
  @IsString()
  @Length(USER_CONSTANTS.validators.minLengthPasswordHash, USER_CONSTANTS.validators.minLengthPasswordHash)
  public passwordHash!: string;
}
