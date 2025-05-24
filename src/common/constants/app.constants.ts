import { HttpStatus } from '@nestjs/common';

import { HTTP_RESPONSE_MESSAGES } from './http.constants';
import { CAPITALIZE_TEXT, GET_NORMALIZE_TEXT } from './text-util.constants';

export const APP_CONSTANTS = {
  message: {
    yourAreUsingInsecureConnection: (): string => {
      return 'You are using an insecure connection (HTTP). Please use HTTPS for better security.';
    },

    maintenanceModeEnabled: (): string => 'The API is currently under maintenance. Please try again later.',

    healthCheckSuccess: (): string => 'The API is healthy and responding correctly.',

    getHello: (): string => 'Hello, I am an Authorization API for NotBadCode projects.',

    routeNotfoundOnHttpMethod: (method: string, route: string): string => {
      return `${method}: ${route} - ${HTTP_RESPONSE_MESSAGES[HttpStatus.NOT_FOUND]}`;
    },

    invalidItemId: (itemDescription: string, itemId: number): string => {
      const NORMALIZE_TEXT: string = GET_NORMALIZE_TEXT.apply(itemDescription);
      const ITEM_ID: number = itemId ?? 0;

      if (!NORMALIZE_TEXT?.length || ITEM_ID === 0) {
        return `The provided ${itemDescription} ID cannot be zero or invalid. Please provide a valid ID.`;
      }

      if (ITEM_ID <= 0) {
        return `The provided ${itemDescription} ID ${ITEM_ID} is invalid. Please check the input and try again.`;
      }

      return `The provided ${itemDescription} ID ${ITEM_ID} is valid.`;
    },

    notFoundUserWithItemId: (itemDescription: string, itemId: number): string => {
      const NORMALIZE_TEXT: string = GET_NORMALIZE_TEXT.apply(itemDescription);
      const ITEM_ID: number = itemId ?? 0;
      if (!NORMALIZE_TEXT?.length || !ITEM_ID) {
        return '';
      }

      return `No ${itemDescription} found with ID ${itemId}. Please verify the ${itemDescription} ID and try again.`;
    },

    getItemWithItemIdIsSuccessfully: (itemDescription: string, itemId: number): string => {
      const NORMALIZE_TEXT: string = GET_NORMALIZE_TEXT.apply(itemDescription);
      const ITEM_ID: number = itemId ?? 0;
      if (!NORMALIZE_TEXT?.length || !ITEM_ID) {
        return '';
      }

      return `${CAPITALIZE_TEXT.apply(itemDescription)} with ID ${itemId} has been successfully retrieved.`;
    },

    itemIsRequired: (itemDescription: string): string => {
      return `${CAPITALIZE_TEXT.apply(itemDescription)} is required.`;
    },

    itemAlreadyExists: (itemDescription: string): string => {
      return `${CAPITALIZE_TEXT.apply(itemDescription)} already exists. Please choose a different one.`;
    },

    dataBaseConnectionIsNotEstablished: (): string => {
      return 'Database connection is not established.';
    },

    dataBaseQueryFailed: (): string => {
      return 'Database query failed. Please try again later.';
    },

    appRunningOn: (port: number | string): string => {
      return '\n🚀 Application is running:\n' + `   Protocol : HTTPS\n` + `   Port     : ${port}\n`;
    },

    databaseRunningOn: (): string => {
      const HOST = process.env.DB_HOST || '';
      const PORT = process.env.DB_PORT || '';
      const NAME = process.env.DB_NAME || '';

      if (!HOST || !PORT || !NAME) {
        return '⚠️  Database configuration is incomplete.\n' + '   Please check the following environment variables:\n' + '   - DB_HOST\n' + '   - DB_PORT\n' + '   - DB_NAME\n';
      }

      return '🛢️  Database connection details:\n' + `   Host : ${HOST}\n` + `   Port : ${PORT}\n` + `   Name : ${NAME}\n`;
    },

    jwtSecretIsNotDefined: 'JWT_SECRET is not defined in environment variables.',
    jwtFromRequestFunctionCouldNotGet: 'JWT_FROM_REQUEST_FUNCTION could not get.',

    accessNotAuthorized: 'Access not authorized.',
  },

  configuration: {
    getHello: 'Hello, I am an Authorization API for NotBadCode projects.',
    defaultAppListenPort: 3000,
    defaultAppListenHttpsPort: 3443,
    forAllRoutesSymbol: '*',
    token: {
      strategy: 'jwt',
    },
  },

  environment: {
    redisHost: 'REDIS_HOST',
    redisPort: 'REDIS_PORT',

    dbHost: 'DB_HOST',
    dbPort: 'DB_PORT',
    dbUsername: 'DB_USERNAME',
    dbPassword: 'DB_PASSWORD',
    dbName: 'DB_NAME',

    jwtSecret: 'JWT_SECRET',
    jwtExpiration: 'JWT_EXPIRATION',

    nodeEnvTest: 'test',
  },
};
