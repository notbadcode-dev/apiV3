import { IsInt, IsString } from 'class-validator';

export class SetLoginHistoryDto {
  @IsInt()
  public userId!: number;

  @IsInt()
  public applicationId!: number;

  @IsString()
  public ipAddress!: string;

  @IsString()
  public userAgent!: string;

  @IsString()
  public failureReason?: string;
}
