import { APP_CONSTANTS } from '@common/constants/app.constants';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TokenService } from './services/token.service';

const JWT_MODULE_REGISTER: DynamicModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>(APP_CONSTANTS.environment.jwtSecret),
    signOptions: {
      expiresIn: configService.get<string>(APP_CONSTANTS.environment.jwtExpiration),
    },
  }),
});

@Module({
  imports: [JWT_MODULE_REGISTER],
  controllers: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
