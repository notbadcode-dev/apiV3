import { GlobalResponseService } from '@common/utils/global-response.service';
import { Body, Controller, Post } from '@nestjs/common';
import { USER_CONSTANTS } from '@user-application-api/modules/user/constants/user.constants';
import { GetUserRequestDto, GetUserResponseDto } from '@user-application-api/modules/user/dtos/getUser.dto';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';
import { UserService } from '@user-application-api/modules/user/services/user/user.service';

@Controller('user')
export class UsersController {
  constructor(private readonly _usersService: UserService) {}

  @Post('getById')
  public async getById(@Body() request: GetUserRequestDto): Promise<GetUserResponseDto> {
    const DATA: UserDto | null = await this._usersService.getById(request);
    const RESPONSE: GetUserResponseDto = GlobalResponseService.getSuccessfullyGlobalResponse(DATA, USER_CONSTANTS.messages.getUserWithUserIdIsSuccessfully(DATA?.id ?? 0));

    return RESPONSE;
  }
}
