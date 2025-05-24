import { IsString, IsOptional, MaxLength } from 'class-validator';

import { APPLICATION_CONSTANTS } from '../constants/application.constants';

export class ApplicationDto {
  public id!: number;

  @IsString()
  @MaxLength(APPLICATION_CONSTANTS.validators.maxLengthName)
  public name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(APPLICATION_CONSTANTS.validators.maxLengthDescription)
  public description?: string;
}
