import { LOGGER } from '@common/modules/logging/services/logger.service';

import { LogMethodDecoratorTestData } from './data/log-method-decorator-test.data';

jest.mock('@common/modules/logging/services/logging.service', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  LoggingService: {
    isFunction: jest.fn().mockReturnValue(false),
    getClassName: jest.fn().mockReturnValue('testMethod'),
  },
}));

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

it('should not proceed if the property is not a function', async () => {
  // Act
  await LogMethodDecoratorTestData.testMethod('Hello', 'World');

  // Assert
  expect(LOGGER.info).not.toHaveBeenCalled();
});
