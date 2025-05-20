import { LOGGING_CONSTANTS } from '@common/modules/logging/constants/logging.constants';
import * as winston from 'winston';

const { combine: COMBINE, timestamp: TIMESTAMP, printf: PRINT_F, colorize: COLORIZE, simple: SIMPLE } = winston.format;

const TRANSPORTS_CONSOLE = {
  format: COMBINE(COLORIZE(), TIMESTAMP(), SIMPLE()),
};

const FILE_FORMAT = COMBINE(
  TIMESTAMP(),
  PRINT_F(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`),
);

const TRANSPORTS_FILE = {
  filename: LOGGING_CONSTANTS.getLogFileName(),
  format: FILE_FORMAT,
  handleExceptions: true,
  maxsize: LOGGING_CONSTANTS.getLogMaxSize(),
  maxFiles: LOGGING_CONSTANTS.getLogMaxFiles,
};

export const LOGGER = winston.createLogger({
  level: LOGGING_CONSTANTS.loggerLevel,
  format: TIMESTAMP(),
  transports: [new winston.transports.Console(TRANSPORTS_CONSOLE), new winston.transports.File(TRANSPORTS_FILE)],
  exitOnError: false,
});
