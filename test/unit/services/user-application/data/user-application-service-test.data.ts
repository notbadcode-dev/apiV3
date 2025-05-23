import { Application } from '@modules/application/entities/application.entity';
import { User } from '@modules/user/entities/user.entity';
import { UserApplicationDto } from '@modules/user-application/dtos/user-application.dto';
import { ValidateUserAccessOnApplicationDto } from '@modules/user-application/dtos/validate-user-access-on-application.dto';
import { UserApplication } from '@modules/user-application/entities/user-application.entity';
import { plainToClass } from 'class-transformer';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { ApplicationServiceTestData } from '../../application/data/application-service-test.data';
import { UserServiceTestData } from '../../user/data/user-service-test.data';

export class UserApplicationServiceTestData {
  public static getValidUserApplicationEntity(): UserApplication {
    const USER: User = UserServiceTestData.getValidUserEntity();
    const APPLICATION: Application = ApplicationServiceTestData.getValidApplicationEntity();

    return {
      userId: USER?.id,
      applicationId: APPLICATION?.id,
      lastAccessAt: new Date(),
      user: USER,
      application: APPLICATION,
    };
  }

  public static getValidUserApplicationDto(): UserApplicationDto {
    return plainToClass(UserApplicationDto, this.getValidUserApplicationEntity(), { excludeExtraneousValues: true });
  }

  public static getFindOneByWhereWithFilteredId(): FindOptionsWhere<UserApplication> {
    return {
      userId: this.getValidUserApplicationEntity().user.id,
      applicationId: this.getValidUserApplicationEntity().application.id,
    };
  }

  public static getValidValidateUserAccessOnApplicationDto(): ValidateUserAccessOnApplicationDto {
    return {
      userId: this.getValidUserApplicationEntity().user.id,
      applicationId: this.getValidUserApplicationEntity().application.id,
      email: this.getValidUserApplicationEntity().user.email,
    };
  }
}
