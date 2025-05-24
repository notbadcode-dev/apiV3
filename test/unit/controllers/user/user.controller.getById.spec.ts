import { GlobalResponseService } from '@common/utils/global-response.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getMocked } from '@test/utils/helpers/jest-helper';
import { USER_CONSTANTS } from '@user-application-api/modules/user/constants/user.constants';
import { GetUserRequestDto, GetUserResponseDto } from '@user-application-api/modules/user/dtos/getUser.dto';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';
import { UserService } from '@user-application-api/modules/user/services/user.service';
import { UsersController } from '@user-application-api/modules/user/user.controller';

import { UserControllerTestData } from './data/user-controller-test.data';

jest.mock('@user-application-api/modules/user/services/user.service');
jest.mock('@common/utils/global-response.service');

let usersController: UsersController;
let userService: jest.Mocked<UserService>;

beforeEach(async () => {
  const MODULE: TestingModule = (await Test.createTestingModule({
    controllers: [UsersController],
    providers: [UserService],
  }).compile()) as TestingModule;

  usersController = MODULE.get<UsersController>(UsersController);
  userService = getMocked<UserService>(MODULE.get(UserService));
});

it('should return the correct response when getting a user by ID', async () => {
  // Arrange
  const MOCK_REQUEST = UserControllerTestData.getValidGetUserRequestDto() as GetUserRequestDto;
  const MOCK_USER_DTO = UserControllerTestData.getValidUserDto() as UserDto;
  const MOCK_USER_ID = MOCK_USER_DTO.id;
  const EXPECTED_RESPONSE = UserControllerTestData.getValidGetUserResponseDto() as GetUserResponseDto;

  userService.getById.mockResolvedValue(MOCK_USER_DTO);
  (GlobalResponseService.getSuccessfullyGlobalResponse as jest.Mock).mockReturnValue(EXPECTED_RESPONSE);

  // Act
  const RESPONSE = await usersController.getById(MOCK_REQUEST);

  // Assert
  expect(userService.getById).toHaveBeenCalledWith(MOCK_REQUEST);
  expect(GlobalResponseService.getSuccessfullyGlobalResponse).toHaveBeenCalledWith(MOCK_USER_DTO, USER_CONSTANTS.messages.getUserWithUserIdIsSuccessfully(MOCK_USER_ID));
  expect(RESPONSE).toEqual(EXPECTED_RESPONSE);
});
