import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { UserDto } from '@modules/user/dtos/user.dto';
import { IsInt, IsPositive } from 'class-validator';

export class GetUserRequestDto {
  @IsInt()
  @IsPositive()
  public id!: number;
}

export class GetUserResponseDto extends GlobalResponseDto<UserDto> {}
