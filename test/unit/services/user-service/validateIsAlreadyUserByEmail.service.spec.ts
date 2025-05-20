import { USER_CONSTANTS } from '@modules/user/constants/user.constants';
import { User } from '@modules/user/entities/user.entity';
import { UserService } from '@modules/user/services/user.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
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

it('should throw BadRequestException if email is empty', async () => {
  const EMPTY_EMAIL = '';

  const RESPONSE = (): Promise<void> => userService.validateIsAlreadyUserByEmail(EMPTY_EMAIL);

  await expect(RESPONSE()).rejects.toThrow(new BadRequestException(USER_CONSTANTS.messages.emailIsRequired()));
  expect(userRepositoryMock.findOneBy).not.toHaveBeenCalled();
});

it('should throw ConflictException if user already exists by email', async () => {
  const EMAIL = UserServiceTestData.getValidUserEntity().email;

  (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(UserServiceTestData.getValidUserEntity());

  const RESPONSE = (): Promise<void> => userService.validateIsAlreadyUserByEmail(EMAIL);

  await expect(RESPONSE()).rejects.toThrow(new ConflictException(USER_CONSTANTS.messages.itemAlreadyExists()));
  expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith(UserServiceTestData.getFindOneByWhereWithFilteredEmail());
});

it('should not throw any exception if user does not exist by email', async () => {
  const EMAIL = UserServiceTestData.getValidUserEntity().email;

  (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

  const RESPONSE = (): Promise<void> => userService.validateIsAlreadyUserByEmail(EMAIL);

  await expect(RESPONSE()).resolves.not.toThrow();
  expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith(UserServiceTestData.getFindOneByWhereWithFilteredEmail());
});
