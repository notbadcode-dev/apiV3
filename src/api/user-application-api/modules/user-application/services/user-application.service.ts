import { LogMethod } from '@common/decorators/logged-method.decorator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { USER_APPLICATION_CONSTANTS } from '../constants/user-application.constants';
import { UserApplicationDto } from '../dtos/user-application.dto';
import { ValidateUserAccessOnApplicationDto } from '../dtos/validate-user-access-on-application.dto';
import { UserApplication } from '../entities/user-application.entity';
import { IUserApplicationService } from './user-application.service.interface';

@Injectable()
export class UserApplicationService implements IUserApplicationService {
  //#region constructor and attributes

  constructor(@InjectRepository(UserApplication) private readonly _userApplicationRepository: Repository<UserApplication>) {}

  //#endregion

  //#endregion public methods

  @LogMethod
  public async validateAccessUserOnApplication(validateUserAccessOnApplication: ValidateUserAccessOnApplicationDto): Promise<void> {
    const { userId: USER_ID, applicationId: APPLICATION_ID, email: EMAIL } = validateUserAccessOnApplication;

    const USER_APPLICATION: UserApplication | null = await this._userApplicationRepository.findOneBy({
      userId: USER_ID,
      applicationId: APPLICATION_ID,
    });
    if (!USER_APPLICATION) {
      throw new NotFoundException(USER_APPLICATION_CONSTANTS.messages.userNotAuthorizedForApplication(EMAIL));
    }
  }

  @LogMethod
  public async addLastAccessAt(userApplication: UserApplicationDto): Promise<void> {
    const { userId: USER_ID, applicationId: APPLICATION_ID } = userApplication;

    await this.validateAccessUserOnApplication(userApplication);

    const USER_APPLICATION: UserApplication | null = await this._userApplicationRepository.findOneBy({
      userId: USER_ID,
      applicationId: APPLICATION_ID,
    });
    if (!USER_APPLICATION) {
      throw new NotFoundException(USER_APPLICATION_CONSTANTS.messages.userNotAuthorizedForApplication());
    }
  }

  //#endregion
}
