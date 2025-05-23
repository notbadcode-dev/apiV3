import { USER_APPLICATION_CONSTANTS } from '@modules/user-application/constants/user-application.constants';
import { UserApplicationDto } from '@modules/user-application/dtos/user-application.dto';
import { UserApplication } from '@modules/user-application/entities/user-application.entity';
import { UserApplicationService } from '@modules/user-application/services/user-application.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserApplicationServiceTestData } from './data/user-application-service-test.data';

let userApplicationService: UserApplicationService;
let userApplicationRepositoryMock: Partial<jest.Mocked<Repository<UserApplication>>>;

beforeEach(async () => {
  userApplicationRepositoryMock = {
    findOneBy: jest.fn(),
  } as Partial<jest.Mocked<Repository<UserApplication>>>;

  const MODULE: TestingModule = await Test.createTestingModule({
    providers: [
      UserApplicationService,
      {
        provide: getRepositoryToken(UserApplication),
        useValue: userApplicationRepositoryMock,
      },
    ],
  }).compile();

  userApplicationService = MODULE.get<UserApplicationService>(UserApplicationService);
});

it('should throw NotFoundException if user is not authorized for the application', async () => {
  // Arrange
  const USER_APPLICATION: UserApplicationDto = UserApplicationServiceTestData.getValidUserApplicationDto();

  (userApplicationRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

  // Act
  const RESPONSE = (): Promise<void> => userApplicationService.addLastAccessAt(USER_APPLICATION);

  // Assert
  await expect(RESPONSE()).rejects.toThrow(new NotFoundException(USER_APPLICATION_CONSTANTS.messages.userNotAuthorizedForApplication()));
  expect(userApplicationRepositoryMock.findOneBy).toHaveBeenCalled();
});

it('should not throw any exception if user is authorized for the application and access is valid', async () => {
  // Arrange
  const USER_APPLICATION: UserApplicationDto = UserApplicationServiceTestData.getValidUserApplicationDto();

  (userApplicationRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(UserApplicationServiceTestData.getFindOneByWhereWithFilteredId());

  // Act
  const RESPONSE = (): Promise<void> => userApplicationService.addLastAccessAt(USER_APPLICATION);

  // Assert
  await expect(RESPONSE()).resolves.not.toThrow();
  expect(userApplicationRepositoryMock.findOneBy).toHaveBeenCalled();
});

it('should throw NotFoundException if user is not authorized for the application', async () => {
  // Arrange
  const USER_APPLICATION: UserApplicationDto = UserApplicationServiceTestData.getValidUserApplicationDto();

  (userApplicationRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

  // Act
  const RESPONSE = (): Promise<void> => userApplicationService.addLastAccessAt(USER_APPLICATION);

  // Assert
  await expect(RESPONSE()).rejects.toThrow(new NotFoundException(USER_APPLICATION_CONSTANTS.messages.userNotAuthorizedForApplication()));
  expect(userApplicationRepositoryMock.findOneBy).toHaveBeenCalledWith({
    userId: USER_APPLICATION.userId,
    applicationId: USER_APPLICATION.applicationId,
  });
});
