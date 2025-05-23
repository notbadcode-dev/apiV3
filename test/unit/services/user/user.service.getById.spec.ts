import { ArgumentException } from '@common/exceptions/argument.exception';
import { USER_CONSTANTS } from '@modules/user/constants/user.constants';
import { UserDto } from '@modules/user/dtos/user.dto';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserServiceTestData } from './data/user-service-test.data';

let userService: UserService;
let userRepositoryMock: Partial<jest.Mocked<Repository<User>>>;

beforeEach(async () => {
  userRepositoryMock = {
    findOneBy: jest.fn(),
  } as Partial<jest.Mocked<Repository<User>>>;

  const MODULE: TestingModule = await Test.createTestingModule({
    providers: [
      UserService,
      {
        provide: getRepositoryToken(User),
        useValue: userRepositoryMock,
      },
    ],
  }).compile();

  userService = MODULE.get<UserService>(UserService);
});

it('should throw ArgumentException if userId is invalid', async () => {
  const INVALID_ID = UserServiceTestData.getInvalidUserId();
  const EXPECTED_MESSAGE = USER_CONSTANTS.messages.invalidUserId(INVALID_ID);

  const RESPONSE = (): Promise<UserDto | null> => userService.getById(UserServiceTestData.getGetUserRequestDtoWithInvalidId());

  await expect(RESPONSE()).rejects.toThrow(new ArgumentException(EXPECTED_MESSAGE));
  expect(userRepositoryMock.findOneBy).not.toHaveBeenCalled();
});

it('should throw NotFoundException if user is not found', async () => {
  const VALID_ID = UserServiceTestData.getValidUserEntity().id;
  const EXPECTED_MESSAGE = USER_CONSTANTS.messages.notFoundUserWithUserId(VALID_ID);

  (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

  const RESPONSE = (): Promise<UserDto | null> => userService.getById(UserServiceTestData.getValidGetUserRequestDto());

  await expect(RESPONSE()).rejects.toThrow(new NotFoundException(EXPECTED_MESSAGE));
});

it('should return UserDto if user is found', async () => {
  const MOCK_USER = UserServiceTestData.getValidUserEntity();
  const MOCK_USER_DTO = UserServiceTestData.getValidUserDto();

  (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(MOCK_USER);

  const RESPONSE = (): Promise<UserDto | null> => userService.getById(UserServiceTestData.getValidGetUserRequestDto());

  await expect(RESPONSE()).resolves.toEqual(MOCK_USER_DTO);
  expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith(UserServiceTestData.getValidGetUserRequestDto());
});
