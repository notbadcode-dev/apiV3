import { GetUserRequestDto } from '@user-application-api/modules/user/dtos/getUser.dto';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';
import { User } from '@user-application-api/modules/user/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export class UserServiceTestData {
  public static getInvalidUserId(): number {
    return -1;
  }

  public static getValidUserEntity(): User {
    return {
      id: 1,
      email: 'test@test.com',
      passwordHash: 'hashedPassword',
    };
  }

  public static getValidUserDto(): UserDto {
    return plainToClass(UserDto, this.getValidUserEntity(), { excludeExtraneousValues: true });
  }

  public static getGetUserRequestDtoWithInvalidId(): GetUserRequestDto {
    return {
      id: this.getInvalidUserId(),
    };
  }

  public static getValidGetUserRequestDto(): GetUserRequestDto {
    return {
      id: this.getValidUserEntity().id,
    };
  }

  public static getFindOneByWhereWithFilteredEmail(): FindOptionsWhere<User> {
    return {
      email: this.getValidUserEntity().email,
    };
  }
}
