import { APP_CONSTANTS } from '@common/constants/app.constants';
import { AccessTokenPayloadDto } from '@common/modules/database/dtos/access-token-payload.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, APP_CONSTANTS.configuration.token.strategy) {
  constructor(configService: ConfigService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const JWT_FROM_REQUEST_FUNCTION: JwtFromRequestFunction = ExtractJwt.fromAuthHeaderAsBearerToken();
    if (!JWT_FROM_REQUEST_FUNCTION) {
      throw new UnauthorizedException(APP_CONSTANTS.message.jwtFromRequestFunctionCouldNotGet);
    }

    const JWT_SECRET = configService.get<string>(APP_CONSTANTS.environment.jwtSecret, { infer: true });
    if (!JWT_SECRET) {
      throw new UnauthorizedException(APP_CONSTANTS.message.jwtSecretIsNotDefined);
    }

    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      jwtFromRequest: JWT_FROM_REQUEST_FUNCTION,
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  public async validate(payload: AccessTokenPayloadDto): Promise<AccessTokenPayloadDto | boolean> {
    return payload;
  }
}
