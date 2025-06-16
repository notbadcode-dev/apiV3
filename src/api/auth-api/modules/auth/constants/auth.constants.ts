const PREFIX_TRANSLATE = 'auth';

export const AUTH_CONSTANTS = {
  messages: {
    invalidCredentials: `${PREFIX_TRANSLATE}.INVALID_CREDENTIALS`,
    loginSuccessfully: `${PREFIX_TRANSLATE}.LOGIN_SUCCESSFULLY`,
    logoutSuccessfully: `${PREFIX_TRANSLATE}.LOGOUT_SUCCESSFULLY`,
    logoutAlreadyDone: `${PREFIX_TRANSLATE}.LOGOUT_ALREADY_DONE`,
    tokenRefreshed: `${PREFIX_TRANSLATE}.TOKEN_REFRESHED`,
    registrationSuccessfully: `${PREFIX_TRANSLATE}.REGISTRATION_SUCCESSFULLY`,
  },

  configuration: {
    bcrypt: {
      salt: 10,
    },
  },
};
