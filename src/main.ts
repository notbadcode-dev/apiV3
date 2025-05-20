import { SecurityConfigurator } from '@common/configuration/security.configuration';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';
import * as path from 'path';

import { AppModule } from './app.module';
import { APP_CONSTANTS } from './common/constants/app.constants';

async function bootstrap(): Promise<void> {
  const [HTTP_APP, HTTPS_APP] = await Promise.all([createHttpApp(), createHttpsApp()]);

  await Promise.all([/* startApp(HTTP_APP, APP_CONSTANTS.configuration.defaultAppListenPort),*/ startApp(HTTPS_APP, APP_CONSTANTS.configuration.defaultAppListenHttpsPort)]);
}

async function createHttpApp(): Promise<NestExpressApplication> {
  const APP = await NestFactory.create<NestExpressApplication>(AppModule);
  applyGlobalConfiguration(APP);
  new SecurityConfigurator(APP).apply();
  return APP;
}

async function createHttpsApp(): Promise<NestExpressApplication> {
  const HTTP_OPTIONS = {
    key: fs.readFileSync(path.join(__dirname, '..', 'cert', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'cert', 'server.cert')),
  };

  const APP = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions: HTTP_OPTIONS,
  });
  applyGlobalConfiguration(APP);
  new SecurityConfigurator(APP).apply();
  return APP;
}

function applyGlobalConfiguration(app: NestExpressApplication): void {
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
}

async function startApp(app: NestExpressApplication, port: number | string): Promise<void> {
  await app.listen(port);

  console.info(APP_CONSTANTS.message.appRunningOn(port));
  console.info(APP_CONSTANTS.message.databaseRunningOn());
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
