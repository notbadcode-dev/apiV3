import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { USER_APPLICATION_CONSTANTS } from '@user-application-api/modules/user-application/constants/user-application.constants';
import { ValidateUserAccessOnApplicationDto } from '@user-application-api/modules/user-application/dtos/validate-user-access-on-application.dto';
import { UserApplication } from '@user-application-api/modules/user-application/entities/user-application.entity';
import { UserApplicationService } from '@user-application-api/modules/user-application/services/user-application.service';
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
  const VALIDATE_USER_ACCESS_ON_APPLICATION: ValidateUserAccessOnApplicationDto = UserApplicationServiceTestData.getValidValidateUserAccessOnApplicationDto();

  (userApplicationRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

  // Act
  const RESPONSE = (): Promise<void> => userApplicationService.validateAccessUserOnApplication(VALIDATE_USER_ACCESS_ON_APPLICATION);

  // Assert
  await expect(RESPONSE()).rejects.toThrow(new NotFoundException(USER_APPLICATION_CONSTANTS.messages.userNotAuthorizedForApplication(VALIDATE_USER_ACCESS_ON_APPLICATION.email)));
  expect(userApplicationRepositoryMock.findOneBy).toHaveBeenCalledWith(UserApplicationServiceTestData.getFindOneByWhereWithFilteredId());
});

it('should not throw any exception if user is authorized for the application', async () => {
  // Arrange
  const VALIDATE_USER_ACCESS_ON_APPLICATION: ValidateUserAccessOnApplicationDto = UserApplicationServiceTestData.getValidValidateUserAccessOnApplicationDto();

  (userApplicationRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(UserApplicationServiceTestData.getFindOneByWhereWithFilteredId());

  // Act
  const RESPONSE = (): Promise<void> => userApplicationService.validateAccessUserOnApplication(VALIDATE_USER_ACCESS_ON_APPLICATION);

  // Assert
  await expect(RESPONSE()).resolves.not.toThrow();
  expect(userApplicationRepositoryMock.findOneBy).toHaveBeenCalledWith(UserApplicationServiceTestData.getFindOneByWhereWithFilteredId());
});
