import { IsString, IsInt, IsPositive, IsEmail, IsIn, IsOptional } from 'class-validator';

import { EAuthenticationType } from '../enums/authentication-type.enum';

export class UserAuthenticatorDto {
  @IsEmail()
  public email!: string;

  @IsString()
  public passwordHash!: string;

  @IsInt()
  @IsPositive()
  public applicationId!: number;

  @IsOptional()
  @IsIn([EAuthenticationType.LOGIN, EAuthenticationType.REGISTRATION])
  public authenticationType?: EAuthenticationType;
}
