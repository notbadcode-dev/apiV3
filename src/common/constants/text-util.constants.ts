import { IApplyConstantsFunction } from '../interfaces/apply-constants.interface';

export const GET_NORMALIZE_TEXT: IApplyConstantsFunction<string, string> = {
  apply: (text: string): string => {
    const NORMALIZED_TEXT: string = text.trim().toLowerCase();

    if (!NORMALIZED_TEXT?.length) {
      return '';
    }

    return NORMALIZED_TEXT;
  },
};

export const CAPITALIZE_TEXT: IApplyConstantsFunction<string, string> = {
  apply: (text: string): string => {
    const NORMALIZED_TEXT: string = GET_NORMALIZE_TEXT.apply(text);

    if (!NORMALIZED_TEXT?.length) {
      return '';
    }

    const FIRST_LETTER: string = NORMALIZED_TEXT.toUpperCase().charAt(0);

    if (text.length === 1) {
      return FIRST_LETTER;
    }

    return `${FIRST_LETTER}${NORMALIZED_TEXT.substring(1)}`;
  },
};
