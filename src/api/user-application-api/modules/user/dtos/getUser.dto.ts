import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { IsInt, IsPositive } from 'class-validator';
import { UserDto } from './user.dto';

export class GetUserRequestDto {
  @IsInt()
  @IsPositive()
  public id!: number;
}

export class GetUserResponseDto extends GlobalResponseDto<UserDto | null> {}
