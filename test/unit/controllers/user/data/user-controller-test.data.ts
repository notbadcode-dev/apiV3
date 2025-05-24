import { EMessageType } from '@common/enums/message-type.enum';
import { UserServiceTestData } from '@test/unit/services/user/data/user-service-test.data';
import { USER_CONSTANTS } from '@user-application-api/modules/user/constants/user.constants';
import { GetUserRequestDto, GetUserResponseDto } from '@user-application-api/modules/user/dtos/getUser.dto';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';

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
