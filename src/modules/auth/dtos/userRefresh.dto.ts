import { GlobalResponseDto } from '@common/dtos/response-base.dto';

import { UserLogoutRequestDto } from './userLogout.dto';

export class UserRefreshRequestDto extends UserLogoutRequestDto {}

export class UserRefreshResponseDto extends GlobalResponseDto<string> {}
