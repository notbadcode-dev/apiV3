import { AccessTokenPayloadDto } from '@common/modules/token/dtos/access-token-payload.dto';

export interface ITokenService {
  getAccessToken(accessTokenPayload: AccessTokenPayloadDto): Promise<string>;

  revokeToken(userId: number): Promise<boolean>;
}
