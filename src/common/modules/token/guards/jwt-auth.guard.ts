import { APP_CONSTANTS } from '@common/constants/app.constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard(APP_CONSTANTS.configuration.token.strategy) {
  public handleRequest<AccessTokenPayloadDto>(err: Error | null, accessTokenPayloadDto: AccessTokenPayloadDto): AccessTokenPayloadDto {
    if (err || !accessTokenPayloadDto) {
      throw new UnauthorizedException(APP_CONSTANTS.message.accessNotAuthorized);
    }

    return accessTokenPayloadDto;
  }
}
