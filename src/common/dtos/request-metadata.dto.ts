import { IsNumber, IsString } from 'class-validator';

export class RequestMetadataDto {
  @IsNumber()
  public applicationId!: number;
  @IsString()
  public userAgent!: string;
  @IsString()
  public ipAddress!: string;
}
