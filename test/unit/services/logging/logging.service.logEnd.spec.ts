import { ILogMethod } from '@common/dtos/log-method.dto';
import { LOGGING_CONSTANTS } from '@common/modules/logging/constants/logging.constants';
import { LOGGER } from '@common/modules/logging/services/logger.service';
import { LoggingService } from '@common/modules/logging/services/logging.service';

import { LoggingServiceTestData } from './data/logging-service-test.data';

jest.mock('@common/modules/logging/services/logger.service', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  LOGGER: {
    info: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

it('should call LOGGER.info with the correct format for logEnd when result is provided', () => {
  // Arrange
  const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethodWithResult();

  // Act
  LoggingService.logEnd(LOG_METHOD);

  // Assert
  expect(LOGGER.info).toHaveBeenCalledWith(`${LOGGING_CONSTANTS.logEnd(LOG_METHOD)}`);
});

it('should call LOGGER.info with the correct format for logEnd when result is void', () => {
  // Arrange
  const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethodWithVoidResult();

  // Act
  LoggingService.logEnd(LOG_METHOD);

  // Assert
  expect(LOGGER.info).toHaveBeenCalledWith(`${LOGGING_CONSTANTS.logEnd(LOG_METHOD)}`);
});
