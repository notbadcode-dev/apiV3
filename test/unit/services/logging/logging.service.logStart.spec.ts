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

it('should call LOGGER.info with the correct format for logStart', () => {
  // Arrange
  const LOG_METHOD: ILogMethod = LoggingServiceTestData.getLogMethod();

  // Act
  LoggingService.logStart(LOG_METHOD);

  // Assert
  expect(LOGGER.info).toHaveBeenCalledWith(`${LOGGING_CONSTANTS.logStart(LOG_METHOD)}`);
});
