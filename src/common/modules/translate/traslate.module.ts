import { APP_CONSTANTS } from '@common/constants/app.constants';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { join } from 'path';

import { TranslateService } from './services/translate.service';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow(APP_CONSTANTS.environment.fallbackLanguage),
        loaderOptions: {
          path: join(process.cwd(), 'src', 'common', 'modules', 'translate', 'i18n'),
          watch: true,
        },
      }),
      resolvers: [{ use: QueryResolver, options: [APP_CONSTANTS.configuration.httpHeader.translateLanguage] }, AcceptLanguageResolver],
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [TranslateService],
  exports: [TranslateService],
})
export class TranslateModule {}
