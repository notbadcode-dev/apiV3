import { GlobalResponseService } from '@common/utils/global-response.service';
import { USER_CONSTANTS } from '@modules/user/constants/user.constants';
import { GetUserRequestDto, GetUserResponseDto } from '@modules/user/dtos/getUser.dto';
import { UserDto } from '@modules/user/dtos/user.dto';
import { UserService } from '@modules/user/services/user.service';
import { UsersController } from '@modules/user/user.controller';
import { Test, TestingModule } from '@nestjs/testing';

import { UserControllerTestData } from './data/user-controller-test.data';

jest.mock('@modules/user/services/user.service');
jest.mock('@common/utils/global-response.service');

let usersController: UsersController;
let userService: UserService;

beforeEach(async () => {
  const MODULE: TestingModule = await Test.createTestingModule({
    controllers: [UsersController],
    providers: [UserService],
  }).compile();

  usersController = MODULE.get<UsersController>(UsersController);
  userService = MODULE.get<UserService>(UserService);
});

it('should return the correct response when getting a user by ID', async () => {
  // Arrange
  const MOCK_REQUEST: GetUserRequestDto = UserControllerTestData.getValidGetUserRequestDto();
  const MOCK_USER_DTO: UserDto = UserControllerTestData.getValidUserDto();
  const MOCK_USER_ID = MOCK_USER_DTO.id;

  const EXPECTED_RESPONSE: GetUserResponseDto = UserControllerTestData.getValidGetUserResponseDto();

  userService.getById = jest.fn().mockResolvedValue(MOCK_USER_DTO);
  GlobalResponseService.getSuccessfullyGlobalResponse = jest.fn().mockReturnValue(EXPECTED_RESPONSE);

  // Act
  const RESPONSE = await usersController.getById(MOCK_REQUEST);

  // Assert
  expect(userService.getById).toHaveBeenCalledWith(MOCK_REQUEST);
  expect(GlobalResponseService.getSuccessfullyGlobalResponse).toHaveBeenCalledWith(MOCK_USER_DTO, USER_CONSTANTS.messages.getUserWithUserIdIsSuccessfully(MOCK_USER_ID));
  expect(RESPONSE).toEqual(EXPECTED_RESPONSE);
});
