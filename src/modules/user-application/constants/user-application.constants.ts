export const USER_APPLICATION_CONSTANTS = {
  messages: {
    userNotAuthorizedForApplication: (email?: string): string => {
      if (email) {
        return `User with email ${email} does not have access to the application. Please check the user's permissions or assign access.`;
      }
      return `The user does not have access to the application. Please check the user's permissions or assign access.`;
    },
  },
};
