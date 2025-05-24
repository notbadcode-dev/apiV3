import { UserLoginRequestDto, UserLoginResponseDto } from '../dtos/userLogin.dto';
import { UserRegisterRequestDto, UserRegisterResponseDto } from '../dtos/userRegister.dto';

export interface IAuthService {
  register(request: UserRegisterRequestDto): Promise<UserRegisterResponseDto>;

  login(request: UserLoginRequestDto): Promise<UserLoginResponseDto>;
}
