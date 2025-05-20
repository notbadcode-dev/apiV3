import { GlobalResponseDto } from '@common/dtos/response-base.dto';

import { UserAuthenticatorDto } from './userAuthenticator.dto';

export class UserRegisterRequestDto extends UserAuthenticatorDto {}

export class UserRegisterResponseDto extends GlobalResponseDto<number> {}
