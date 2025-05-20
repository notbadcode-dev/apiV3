import { IsEmail, IsInt, IsPositive } from 'class-validator';

export class ValidateUserAccessOnApplicationDto {
  @IsInt()
  @IsPositive()
  public userId!: number;

  @IsInt()
  @IsPositive()
  public applicationId!: number;

  @IsEmail()
  public email?: string;
}
