import { APP_CONSTANTS } from '@common/constants/app.constants';
import { TransactionService } from '@common/modules/database/services/transaction.service';
import { InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

import { TransactionServiceTestData } from './data/transaction-service-test.data';

let transactionService: TransactionService;
let dataSourceMock: Partial<DataSource>;
let queryRunnerMock: jest.Mocked<Partial<QueryRunner>>;
let managerMock: jest.Mocked<Partial<EntityManager>>;

beforeEach(async () => {
  managerMock = {
    save: jest.fn(),
  } as jest.Mocked<Partial<EntityManager>>;

  queryRunnerMock = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: managerMock as jest.Mocked<EntityManager>,
  } as jest.Mocked<Partial<QueryRunner>>;

  dataSourceMock = {
    createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock), // Only mock this method
  };

  transactionService = new TransactionService(dataSourceMock as DataSource);
});

it('should run transaction and commit if no errors', async () => {
  // Arrange
  const CALLBACK_MOCK = jest.fn().mockResolvedValue(TransactionServiceTestData.getSuccessfullyTestResult());

  // Act
  const RESULT = await transactionService.runTransaction(CALLBACK_MOCK);

  // Assert
  expect(CALLBACK_MOCK).toHaveBeenCalled();
  expect(RESULT).toBe(TransactionServiceTestData.getSuccessfullyTestResult());
  expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
  expect(queryRunnerMock.release).toHaveBeenCalled();
});

it('should rollback transaction and throw InternalServerErrorException if error occurs', async () => {
  // Arrange
  const CALLBACK_MOCK = jest.fn().mockRejectedValue(TransactionServiceTestData.getNewError());

  // Act & Assert
  await expect(transactionService.runTransaction(CALLBACK_MOCK)).rejects.toThrow(new InternalServerErrorException(APP_CONSTANTS.message.dataBaseQueryFailed()));
  expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  expect(queryRunnerMock.release).toHaveBeenCalled();
});

it('should release queryRunner even if error occurs', async () => {
  // Arrange
  const CALLBACK_MOCK = jest.fn().mockRejectedValue(TransactionServiceTestData.getNewError());

  // Act & Assert
  try {
    await transactionService.runTransaction(CALLBACK_MOCK);
  } catch (error) {
    // Assert
    expect(error).not.toBeNull();
    expect(queryRunnerMock.release).toHaveBeenCalled();
  }
});
