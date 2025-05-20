import { LogMethod } from '@common/decorators/logged-method.decorator';
import { AccessTokenPayloadDto } from '@common/modules/database/dtos/access-token-payload.dto';
import { RedisService } from '@common/modules/redis/services/redis.service';
import { USER_CONSTANTS } from '@modules/user/constants/user.constants';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// eslint-disable-next-line @typescript-eslint/naming-convention

import { ITokenService } from './token.service.interface';

@Injectable()
export class TokenService implements ITokenService {
  //#region constructor and attributes

  constructor(
    private readonly _redisService: RedisService,
    private readonly _jwtService: JwtService,
  ) {}

  //#endregion

  //#region Public methods

  @LogMethod
  public async getAccessToken(accessTokenPayload: AccessTokenPayloadDto): Promise<string> {
    this.validateArgumentsForGetAccessToken(accessTokenPayload);

    const EXISTING_TOKEN = await this._redisService.getAccessToken(accessTokenPayload.userId);

    if (EXISTING_TOKEN) {
      return EXISTING_TOKEN;
    }

    const ACCESS_TOKEN: string = this._jwtService.sign(accessTokenPayload);

    await this._redisService.setAccessToken(accessTokenPayload.userId, ACCESS_TOKEN);

    return ACCESS_TOKEN;
  }

  @LogMethod
  public async revokeToken(userId: number): Promise<boolean> {
    return await this._redisService.expireAccessToken(userId);
  }

  //#endregion

  //#region Private methods

  @LogMethod
  private validateArgumentsForGetAccessToken(accessTokenPayload: AccessTokenPayloadDto): void {
    if (!accessTokenPayload.email.trim()?.length) {
      throw new BadRequestException(USER_CONSTANTS.messages.emailIsRequired());
    }

    const USER_ID: number = accessTokenPayload.userId;

    if (!USER_ID || USER_ID <= 0) {
      throw new BadRequestException(USER_CONSTANTS.messages.userIdIsRequired());
    }
  }

  //#endregion
}
