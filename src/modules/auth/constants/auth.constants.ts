export const AUTH_CONSTANTS = {
  messages: {
    invalidCredentials: (): string => {
      return `Invalid credentials: The email or password you entered is incorrect. Please verify and try again.`;
    },

    loginSuccessfully: (): string => {
      return `Login successful: You have successfully logged in. Welcome!`;
    },

    logoutSuccessfully: (): string => 'User successfully logged out.',

    logoutAlreadyDone: (): string => {
      return 'Logout already completed: the token was already invalidated or expired.';
    },

    registrationSuccessfully: (): string => {
      return `Registration successful: You have been successfully registered. Welcome aboard!`;
    },
  },

  configuration: {
    bcrypt: {
      salt: 10,
    },
  },
};
