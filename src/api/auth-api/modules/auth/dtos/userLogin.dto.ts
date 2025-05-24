import { GlobalResponseDto } from '@common/dtos/response-base.dto';

import { UserAuthenticatorDto } from './userAuthenticator.dto';

export class UserLoginRequestDto extends UserAuthenticatorDto {}

export class UserLoginResponseDto extends GlobalResponseDto<string> {}
