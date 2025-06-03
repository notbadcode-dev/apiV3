import { APP_CONSTANTS } from '@common/constants/app.constants';
import { TransactionService } from '@common/modules/database/services/transaction.service';
import { InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

import { TransactionServiceTestData } from './data/transaction-service-test.data';

let transactionService: TransactionService;
let queryRunnerMock: Partial<jest.Mocked<QueryRunner>>;
let dataSourceMock: Partial<jest.Mocked<DataSource>>;

beforeEach(() => {
  const MANAGER_MOCK = {
    save: jest.fn(),
  } as Partial<jest.Mocked<EntityManager>>;

  queryRunnerMock = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: MANAGER_MOCK,
  } as Partial<jest.Mocked<EntityManager>>;

  dataSourceMock = {
    createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
  } as Partial<jest.Mocked<DataSource>>;

  transactionService = new TransactionService(dataSourceMock as jest.Mocked<DataSource>);
});

afterEach(() => {
  jest.clearAllMocks();
});

it('should run transaction and commit if no errors', async () => {
  // Arrange
  const RESULT = TransactionServiceTestData.getSuccessfullyTestResult();
  const CALL_BACK = jest.fn().mockResolvedValue(RESULT);

  // Act
  const RESPONSE = await transactionService.runTransaction(CALL_BACK);

  // Assert
  expect(dataSourceMock.createQueryRunner).toHaveBeenCalled();
  expect(queryRunnerMock.connect).toHaveBeenCalled();
  expect(queryRunnerMock.startTransaction).toHaveBeenCalled();
  expect(CALL_BACK).toHaveBeenCalledWith(queryRunnerMock.manager);
  expect(queryRunnerMock.commitTransaction).toHaveBeenCalled();
  expect(queryRunnerMock.release).toHaveBeenCalled();
  expect(RESPONSE).toBe(RESULT);
});

it('should rollback and throw InternalServerErrorException on error', async () => {
  // Arrange
  const CALL_BACK = jest.fn().mockRejectedValue(TransactionServiceTestData.getNewError());

  // Act & Assert
  await expect(transactionService.runTransaction(CALL_BACK)).rejects.toThrow(new InternalServerErrorException(APP_CONSTANTS.message.dataBaseQueryFailed()));

  expect(queryRunnerMock.rollbackTransaction).toHaveBeenCalled();
  expect(queryRunnerMock.release).toHaveBeenCalled();
});

it('should always release queryRunner even if error occurs', async () => {
  // Arrange
  const CALL_BACK = jest.fn().mockRejectedValue(TransactionServiceTestData.getNewError());

  // Act
  try {
    await transactionService.runTransaction(CALL_BACK);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    // Assert
    expect(queryRunnerMock.release).toHaveBeenCalled();
  }
});
