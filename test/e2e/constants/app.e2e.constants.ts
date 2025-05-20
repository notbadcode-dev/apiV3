import { APP_CONSTANTS } from '@common/constants/app.constants';
import { EMessageType } from '@common/enums/message-type.enum';
import { HttpStatus } from '@nestjs/common';

export const APP_E2E_CONSTANTS = {
  getHelloRoute: {
    path: '/',
    response: {
      data: null,
      messageList: [{ type: EMessageType.SUCCESSFULLY, message: APP_CONSTANTS.configuration.getHello }],
    },
  },

  notFoundRoute: {
    path: '/not-found-route-test',
    request: {
      body: {
        invalid: 'Test',
      },
    },
    response: {
      error: 'Not Found',
      message: 'Cannot POST /not-found-route-test',
      httpStatus: HttpStatus.NOT_FOUND,
    },
  },

  defaultExecutionItTimeout: 10000,
};
