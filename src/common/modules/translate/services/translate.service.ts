import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class TranslateService {
  //#region Constructor

  constructor(private readonly _i18n: I18nService) {}

  //#endregion

  //#region Public Methods

  public async translateWithoutArguments(key: string): Promise<string> {
    return this._i18n.translate(key, { lang: I18nContext.current()?.lang });
  }

  //#endregion
}
