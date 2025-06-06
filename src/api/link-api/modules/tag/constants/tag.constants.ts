import { CAPITALIZE_TEXT } from '@common/constants/text-util.constants';

const TAG_ENTITY_NAME = 'tag';

export const TAG_CONSTANTS = {
  messages: {
    tagCreatedSuccessfully: (): string => {
      return `${CAPITALIZE_TEXT.apply(TAG_ENTITY_NAME)} created successfully.`;
    },
  },
};
