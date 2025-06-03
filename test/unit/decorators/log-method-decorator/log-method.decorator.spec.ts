import { APP_CONSTANTS } from '@common/constants/app.constants';

process.env.NODE_ENV = APP_CONSTANTS.environment.nodeEnvDevelopment;

import { LOGGER } from '@common/modules/logging/services/logger.service';

import { LogMethodDecoratorTestData } from './data/log-method-decorator-test.data';

jest.mock('@common/modules/logging/services/logger.service', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  LOGGER: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  process.env.NODE_ENV = APP_CONSTANTS.environment.nodeEnvTest;
});

it('should log start, end and error correctly for testMethod', async () => {
  const RESULT = await LogMethodDecoratorTestData.testMethod('Hello', 'World');

  expect(LOGGER.info).toHaveBeenCalledWith(expect.stringContaining(LogMethodDecoratorTestData.getStartingTestMethodMessage()));
  expect(LOGGER.info).toHaveBeenCalledWith(expect.stringContaining(LogMethodDecoratorTestData.getFinishedTestMethodMessage()));
  expect(RESULT).toBe('Hello World');
});

it('should log error correctly if method throws an error', async () => {
  try {
    await LogMethodDecoratorTestData.testMethodWithError();
  } catch (error) {
    expect(LOGGER.error).toHaveBeenCalledWith(expect.stringContaining(LogMethodDecoratorTestData.getTestMethodWithErrorMessage()));
    expect(error).toBeInstanceOf(Error);
  }
});

it('should log start and end correctly when multiple methods are called concurrently', async () => {
  const ARG1 = 'Hello';
  const ARG2 = 'World';
  const EXPECTED_RESULT = 'Hello World';

  const PROMISES = [LogMethodDecoratorTestData.testMethod(ARG1, ARG2), LogMethodDecoratorTestData.testMethod(ARG1, ARG2), LogMethodDecoratorTestData.testMethod(ARG1, ARG2)];

  const RESULTS = await Promise.all(PROMISES);

  RESULTS.forEach(() => {
    expect(LOGGER.info).toHaveBeenCalledWith(expect.stringContaining(LogMethodDecoratorTestData.getStartingTestMethodMessage()));
    expect(LOGGER.info).toHaveBeenCalledWith(expect.stringContaining(LogMethodDecoratorTestData.getFinishedTestMethodMessage()));
  });

  expect(RESULTS).toEqual([EXPECTED_RESULT, EXPECTED_RESULT, EXPECTED_RESULT]);
});

it('should log error correctly if method throws an error when called concurrently', async () => {
  const EXPECTED_ERROR = LogMethodDecoratorTestData.getError();

  try {
    const PROMISES = [LogMethodDecoratorTestData.testMethodWithError(), LogMethodDecoratorTestData.testMethodWithError()];

    await Promise.all(PROMISES);
  } catch (error: unknown) {
    if (error instanceof Error) {
      expect(LOGGER.error).toHaveBeenCalledWith(expect.stringContaining(LogMethodDecoratorTestData.getTestMethodWithErrorMessage()));
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(EXPECTED_ERROR.message);
    } else {
      throw new Error(LogMethodDecoratorTestData.getCaughtObjectIsNotAnInstanceOfError());
    }
  }
});

it('should log multiple concurrent errors independently', async () => {
  const EXPECTED_ERROR = LogMethodDecoratorTestData.getError();

  try {
    const PROMISES = [LogMethodDecoratorTestData.testMethodWithError(), LogMethodDecoratorTestData.testMethodWithError()];

    await Promise.all(PROMISES);
  } catch (error: unknown) {
    if (error instanceof Error) {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expect(LOGGER.error).toHaveBeenCalledTimes(2);
      expect(LOGGER.error).toHaveBeenCalledWith(expect.stringContaining(LogMethodDecoratorTestData.getTestMethodWithErrorMessage()));
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(EXPECTED_ERROR.message);
    } else {
      throw new Error(LogMethodDecoratorTestData.getCaughtObjectIsNotAnInstanceOfError());
    }
  }
});
