
import { GetUserRequestDto } from '../dtos/getUser.dto';
import { UserDto } from '../dtos/user.dto';

export interface IUserService {
  getById(request: GetUserRequestDto): Promise<UserDto | null>;

  getUserByEmail(email: string): Promise<UserDto | null>;

  validateIsAlreadyUserByEmail(email: string): Promise<void>;
}
