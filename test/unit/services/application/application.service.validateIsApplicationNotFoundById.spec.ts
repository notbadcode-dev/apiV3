import { ArgumentException } from '@common/exceptions/argument.exception';
import { APPLICATION_CONSTANTS } from '@modules/application/constants/application.constants';
import { Application } from '@modules/application/entities/application.entity';
import { ApplicationService } from '@modules/application/services/application.service';
import { NotFoundException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApplicationServiceTestData } from './data/application-service-test.data';

let applicationService: ApplicationService;
let applicationRepositoryMock: Partial<jest.Mocked<Repository<Application>>>;

beforeEach(async () => {
  applicationRepositoryMock = {
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  } as Partial<jest.Mocked<Repository<Application>>>;

  const MODULE: TestingModule = await Test.createTestingModule({
    providers: [
      ApplicationService,
      {
        provide: getRepositoryToken(Application),
        useValue: applicationRepositoryMock,
      },
    ],
  }).compile();

  applicationService = MODULE.get<ApplicationService>(ApplicationService);
});

it('should throw ArgumentException if applicationId is invalid and not call findOneBy', async () => {
  // Arrange
  const INVALID_ID = ApplicationServiceTestData.getInvalidApplicationId();
  const EXPECTED_MESSAGE = APPLICATION_CONSTANTS.messages.notFoundApplicationWithApplicationId(INVALID_ID);

  // Act
  const RESPONSE = (): Promise<void> => applicationService.validateIsApplicationNotFoundById(INVALID_ID);

  // Assert
  await expect(RESPONSE()).rejects.toThrow(new ArgumentException(EXPECTED_MESSAGE));
  expect(applicationRepositoryMock.findOneBy).not.toHaveBeenCalled();
});

it('should throw NotFoundException if application is not found by valid applicationId', async () => {
  // Arrange
  const VALID_ID = ApplicationServiceTestData.getValidApplicationEntity().id;
  const EXPECTED_MESSAGE = APPLICATION_CONSTANTS.messages.notFoundApplicationWithApplicationId(VALID_ID);

  (applicationRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

  // Act
  const RESPONSE = (): Promise<void> => applicationService.validateIsApplicationNotFoundById(VALID_ID);

  // Assert
  await expect(RESPONSE()).rejects.toThrow(new NotFoundException(EXPECTED_MESSAGE));
});

it('should not throw any exception if application is found by valid applicationId', async () => {
  // Arrange
  const VALID_ID = ApplicationServiceTestData.getValidApplicationEntity().id;
  const MOCK_APPLICATION = ApplicationServiceTestData.getValidApplicationEntity();

  (applicationRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(MOCK_APPLICATION);

  // Act
  const RESPONSE = (): Promise<void> => applicationService.validateIsApplicationNotFoundById(VALID_ID);

  // Assert
  await expect(RESPONSE()).resolves.not.toThrow();
});
