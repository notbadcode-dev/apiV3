import { APP_CONSTANTS } from '@common/constants/app.constants';
import { CAPITALIZE_TEXT } from '@common/constants/text-util.constants';

const USER_ENTITY_NAME = 'user';

export const USER_CONSTANTS = {
  messages: {
    invalidUserId: (userId: number): string => {
      return APP_CONSTANTS.message.invalidItemId(USER_ENTITY_NAME, userId);
    },

    notFoundUserWithUserId: (userId: number): string => {
      return APP_CONSTANTS.message.notFoundUserWithItemId(USER_ENTITY_NAME, userId);
    },

    notFoundUserWithUserEmail: (email: string): string => {
      return `No ${CAPITALIZE_TEXT.apply(USER_ENTITY_NAME)} found with email ${email?.trim()?.toLowerCase()}. Please verify the email and try again.`;
    },

    getUserWithUserIdIsSuccessfully: (userId: number): string => {
      return APP_CONSTANTS.message.getItemWithItemIdIsSuccessfully(USER_ENTITY_NAME, userId);
    },

    itemAlreadyExists: (): string => {
      return APP_CONSTANTS.message.itemAlreadyExists(USER_ENTITY_NAME);
    },

    userRegisteredSuccessfully: (): string => {
      return `${CAPITALIZE_TEXT.apply(USER_ENTITY_NAME)} registered successfully.`;
    },

    userIdIsRequired: (): string => {
      return APP_CONSTANTS.message.itemIsRequired('user');
    },

    emailIsRequired: (): string => {
      return APP_CONSTANTS.message.itemIsRequired('email');
    },

    passwordHashIsRequired: (): string => {
      return APP_CONSTANTS.message.itemIsRequired('password');
    },

    applicationIdIsRequired: (): string => {
      return APP_CONSTANTS.message.itemIsRequired('application');
    },

    tokenIsRequired: (): string => {
      return APP_CONSTANTS.message.itemIsRequired('token');
    },
  },

  validators: {
    minLengthPasswordHash: 60,
    maxLengthPasswordHash: 60,

    maxLengthEmail: 250,
  },

  defaults: {
    isActive: true,
  },
};
