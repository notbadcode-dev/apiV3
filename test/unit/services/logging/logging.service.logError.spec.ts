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

it('should call LOGGER.error with the correct format for logError when an error is provided', () => {
  // Arrange
  const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethodWithError();

  // Act
  LoggingService.logError(LOG_METHOD);

  // Assert
  expect(LOGGER.error).toHaveBeenCalledWith(`${LOGGING_CONSTANTS.logError(LOG_METHOD)}`);
});

it('should call LOGGER.error with the correct format for logError when an error is not provided', () => {
  // Arrange
  const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethod();

  // Act
  LoggingService.logError(LOG_METHOD);

  // Assert
  expect(LOGGER.error).toHaveBeenCalledWith(`${LOGGING_CONSTANTS.logError(LOG_METHOD)}`);
});
