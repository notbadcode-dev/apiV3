import { APP_CONSTANTS } from '@common/constants/app.constants';

const APPLICATION_ENTITY_NAME = 'application';

export const APPLICATION_CONSTANTS = {
  messages: {
    invalidApplicationId: (applicationId: number): string => {
      return APP_CONSTANTS.message.invalidItemId(APPLICATION_ENTITY_NAME, applicationId);
    },

    notFoundApplicationWithApplicationId: (applicationId: number): string => {
      return APP_CONSTANTS.message.notFoundUserWithItemId(APPLICATION_ENTITY_NAME, applicationId);
    },
  },

  validators: {
    maxLengthName: 250,
    maxLengthDescription: 250,
  },
};
