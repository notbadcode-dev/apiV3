import { EMessageType } from '@common/enums/message-type.enum';
import { USER_CONSTANTS } from '@modules/user/constants/user.constants';
import { GetUserRequestDto, GetUserResponseDto } from '@modules/user/dtos/getUser.dto';
import { UserDto } from '@modules/user/dtos/user.dto';
import { UserServiceTestData } from '@test/unit/services/user/data/user-service-test.data';

export class UserControllerTestData {
  public static getValidUserDto(): UserDto {
    return UserServiceTestData.getValidUserDto();
  }

  public static getValidGetUserRequestDto(): GetUserRequestDto {
    return UserServiceTestData.getValidGetUserRequestDto();
  }

  public static getValidGetUserResponseDto(): GetUserResponseDto {
    const DATA: UserDto = this.getValidUserDto();

    return {
      data: DATA,
      messageList: [
        {
          type: EMessageType.SUCCESSFULLY,
          message: USER_CONSTANTS.messages.getUserWithUserIdIsSuccessfully(DATA.id),
        },
      ],
    };
  }
}
