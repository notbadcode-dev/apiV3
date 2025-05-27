import { GetUserRequestDto } from '@user-application-api/modules/user/dtos/getUser.dto';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';

export interface IUserService {
  getById(request: GetUserRequestDto): Promise<UserDto | null>;

  getUserByEmail(email: string): Promise<UserDto | null>;

  validateIsAlreadyUserByEmail(email: string): Promise<void>;
}
