import { ApplicationDto } from '@modules/application/dtos/application.dto'; // Asegúrate de importar el ApplicationDto
import { UserDto } from '@modules/user/dtos/user.dto'; // Asegúrate de importar el UserDto
import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsOptional, IsDateString } from 'class-validator';

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
