import { GlobalResponseDto } from '@common/dtos/response-base.dto';

import { UserAuthenticatorDto } from './user-authenticator.dto';

export class UserRegisterRequestDto extends UserAuthenticatorDto {}

export class UserRegisterResponseDto extends GlobalResponseDto<number> {}
