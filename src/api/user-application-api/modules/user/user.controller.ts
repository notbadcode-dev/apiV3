import { GlobalResponseService } from '@common/utils/global-response.service';
import { Body, Controller, Post } from '@nestjs/common';

import { USER_CONSTANTS } from './constants/user.constants';
import { GetUserRequestDto, GetUserResponseDto } from './dtos/getUser.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './services/user.service';

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
