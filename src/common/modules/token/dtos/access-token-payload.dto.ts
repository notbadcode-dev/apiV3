import { IsBoolean, IsEmail, IsInt } from 'class-validator';

export class AccessTokenPayloadDto {
  @IsEmail()
  public email!: string;

  @IsInt()
  public userId!: number;

  @IsBoolean()
  public tryGetIfExists?: boolean;
}
