import { IsEmail, IsInt } from 'class-validator';

export class AccessTokenPayloadDto {
  @IsEmail()
  public email!: string;

  @IsInt()
  public userId!: number;
}
