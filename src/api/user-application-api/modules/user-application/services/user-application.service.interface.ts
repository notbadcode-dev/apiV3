import { UserApplicationDto } from '../dtos/user-application.dto';
import { ValidateUserAccessOnApplicationDto } from '../dtos/validate-user-access-on-application.dto';

export interface IUserApplicationService {
  validateAccessUserOnApplication(validateUserAccessOnApplication: ValidateUserAccessOnApplicationDto): Promise<void>;

  addLastAccessAt(userApplication: UserApplicationDto): Promise<void>;
}
