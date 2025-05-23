import { LogMethod } from '@common/decorators/logged-method.decorator';
import { RedisService } from '@common/modules/redis/services/redis.service';
import { AccessTokenPayloadDto } from '@common/modules/token/dtos/access-token-payload.dto';
import { USER_CONSTANTS } from '@modules/user/constants/user.constants';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// eslint-disable-next-line @typescript-eslint/naming-convention

import { ITokenService } from './token.service.interface';
import { TOKEN_CONSTANTS } from '../constants/token.constants';

@Injectable()
export class TokenService implements ITokenService {
  //#region constructor and attributes

  constructor(
    private readonly _redisService: RedisService,
    @Inject(JwtService) private readonly _jwtService: JwtService,
  ) {}

  //#endregion

  //#region Public methods

  @LogMethod
  public async getAccessToken(accessTokenPayload: AccessTokenPayloadDto): Promise<string> {
    this.validateArgumentsForGetAccessToken(accessTokenPayload);

    if (!accessTokenPayload.tryGetIfExists) {
      const ACCESS_TOKEN: string = await this._jwtService.signAsync(accessTokenPayload);

      await this._redisService.setAccessToken(accessTokenPayload.userId, ACCESS_TOKEN);

      return ACCESS_TOKEN;
    }

    const EXISTING_TOKEN = await this.getExistingToken(accessTokenPayload.userId);

    if (!EXISTING_TOKEN?.length) {
      return '';
    }

    return EXISTING_TOKEN;
  }

  @LogMethod
  public async revokeToken(userId: number): Promise<boolean> {
    return await this._redisService.expireAccessToken(userId);
  }

  @LogMethod
  public async refreshToken(userId: number): Promise<string> {
    const EXISTING_TOKEN = await this.getExistingToken(userId);
    if (!EXISTING_TOKEN) {
      throw new NotFoundException(TOKEN_CONSTANTS.messages.previousTokenNotFound);
    }

    await this.verifyToken(userId, EXISTING_TOKEN);
    await this.revokeToken(userId);

    const VERIFY_TOKEN = await this._jwtService.verifyAsync<AccessTokenPayloadDto>(EXISTING_TOKEN);
    const ACCESS_TOKEN_PAYLOAD: AccessTokenPayloadDto = {
      userId: VERIFY_TOKEN.userId,
      email: VERIFY_TOKEN.email,
      tryGetIfExists: false,
    };

    await this._jwtService.verifyAsync<AccessTokenPayloadDto>(EXISTING_TOKEN);
    const NEW_TOKEN: string = await this.getAccessToken(ACCESS_TOKEN_PAYLOAD);

    return NEW_TOKEN;
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

  @LogMethod
  private async getExistingToken(userId: number): Promise<string | null> {
    const EXISTING_TOKEN = await this._redisService.getAccessToken(userId);
    if (!EXISTING_TOKEN) {
      return null;
    }

    return await this.verifyToken(userId, EXISTING_TOKEN);
  }

  @LogMethod
  private async verifyToken(userId: number, token: string): Promise<string | null> {
    try {
      await this._jwtService.verifyAsync<AccessTokenPayloadDto>(token);
      return token;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.name === TOKEN_CONSTANTS.tokenExpiredErrorTag) {
        await this.revokeToken(userId);
        return null;
      }

      throw error;
    }
  }

  //#endregion
}
