
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApplicationDto } from '../../application/dtos/application.dto';
import { UserDto } from '../../user/dtos/user.dto';

export class UserApplicationDto {
  @IsInt()
  @IsPositive()
  public userId!: number;

  @IsInt()
  @IsPositive()
  public applicationId!: number;

  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  public lastAccessAt?: Date | null;

  public user!: UserDto;

  public application!: ApplicationDto;
}
