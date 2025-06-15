import { Injectable } from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

import { TranslateOptionsWithoutArgumentsDto } from '../dtos/translate.dto';

@Injectable()
export class TranslateService {
  //#region Constructor

  constructor(private readonly _i18n: I18nService) {}

  //#endregion

  //#region Public Methods

  public async translateWithoutArguments(options: TranslateOptionsWithoutArgumentsDto): Promise<string> {
    const context = I18nContext.current();
    const LANG = context?.lang;
    return this._i18n.translate(options.key, { lang: LANG });
  }

  //#endregion
}
