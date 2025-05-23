import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { IsInt } from 'class-validator';

export class UserLogoutRequestDto {
  @IsInt()
  public userId!: number;
}

export class UserLogoutResponseDto extends GlobalResponseDto<boolean> {}
