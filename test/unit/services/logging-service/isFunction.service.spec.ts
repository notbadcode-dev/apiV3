import { ILogMethod } from '@common/dtos/log-method.dto';
import { LOGGING_CONSTANTS } from '@common/modules/logging/constants/logging.constants';
import { LOGGER } from '@common/modules/logging/services/logger.service';
import { LoggingService } from '@common/modules/logging/services/logging.service';

import { LoggingServiceTestData } from './data/logging-service-test.data';

jest.mock('@common/modules/logging/services/logger.service', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  LOGGER: {
    error: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

it('should log an error when the method is not a function', () => {
  // Arrange
  const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethodWithValueIsUnknown();

  // Act
  const RESULT = LoggingService.isFunction(LOG_METHOD);

  // Assert
  expect(RESULT).toBe(false);
  expect(LOGGER.error).toHaveBeenCalledWith(expect.stringContaining(`${LOGGING_CONSTANTS.isNotAFunctionMessage(LOG_METHOD)}`));
});

it('should return true if the method is a function', () => {
  // Arrange
  const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethod();

  // Act
  const RESULT = LoggingService.isFunction(LOG_METHOD);

  // Assert
  expect(RESULT).toBe(true);
  expect(LOGGER.error).not.toHaveBeenCalled();
});
