import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { IsInt, IsString } from 'class-validator';

export class UserLogoutRequestDto {
  @IsString()
  public token!: string;

  @IsInt()
  public userId!: number;
}

export class UserLogoutResponseDto extends GlobalResponseDto<boolean> {}
