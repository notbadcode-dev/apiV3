import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { USER_CONSTANTS } from '@user-application-api/modules/user/constants/user.constants';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';
import { User } from '@user-application-api/modules/user/entities/user.entity';
import { UserService } from '@user-application-api/modules/user/services/user.service';
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

it('should throw BadRequestException if email is empty', async () => {
  const EMPTY_EMAIL = '';

  const RESPONSE = (): Promise<UserDto | null> => userService.getUserByEmail(EMPTY_EMAIL);

  await expect(RESPONSE()).rejects.toThrow(new BadRequestException(USER_CONSTANTS.messages.emailIsRequired()));
  expect(userRepositoryMock.findOneBy).not.toHaveBeenCalled();
});

it('should throw NotFoundException if user is not found by email', async () => {
  const EMAIL = UserServiceTestData.getValidUserEntity().email;
  const EXPECTED_MESSAGE = USER_CONSTANTS.messages.notFoundUserWithUserEmail(EMAIL);

  (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

  const RESPONSE = (): Promise<UserDto | null> => userService.getUserByEmail(EMAIL);

  await expect(RESPONSE()).rejects.toThrow(new NotFoundException(EXPECTED_MESSAGE));
});

it('should return UserDto if user is found by email', async () => {
  const MOCK_USER = UserServiceTestData.getValidUserEntity();
  const MOCK_USER_DTO = UserServiceTestData.getValidUserDto();

  (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(MOCK_USER);

  const RESPONSE = (): Promise<UserDto | null> => userService.getUserByEmail(MOCK_USER.email);

  await expect(RESPONSE()).resolves.toEqual(MOCK_USER_DTO);
  expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith(UserServiceTestData.getFindOneByWhereWithFilteredEmail());
});
