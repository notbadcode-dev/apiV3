import { LogMethod } from '@common/decorators/logged-method.decorator';
import { ArgumentException } from '@common/exceptions/argument.exception';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USER_CONSTANTS } from '@user-application-api/modules/user/constants/user.constants';
import { GetUserRequestDto } from '@user-application-api/modules/user/dtos/getUser.dto';
import { UserDto } from '@user-application-api/modules/user/dtos/user.dto';
import { User } from '@user-application-api/modules/user/entities/user.entity';
import { IUserService } from '@user-application-api/modules/user/services/user/user.service.interface';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

@Injectable()
export class UserService implements IUserService {
  //#region constructor and attributes

  constructor(@InjectRepository(User) private _userRepository: Repository<User>) {}

  //#endregion

  //#region Public methods

  @LogMethod
  public async getById(request: GetUserRequestDto): Promise<UserDto | null> {
    const USER_ID: number = request?.id;
    if (!Number.isInteger(USER_ID) || USER_ID <= 0) {
      throw new ArgumentException(USER_CONSTANTS.messages.invalidUserId(USER_ID));
    }

    const USER_ENTITY = await this._userRepository.findOneBy({ id: USER_ID });
    if (!USER_ENTITY) {
      throw new NotFoundException(USER_CONSTANTS.messages.notFoundUserWithUserId(USER_ID));
    }

    return plainToClass(UserDto, USER_ENTITY, { excludeExtraneousValues: true });
  }

  @LogMethod
  public async getUserByEmail(email: string): Promise<UserDto | null> {
    if (!email.trim()?.length) {
      throw new BadRequestException(USER_CONSTANTS.messages.emailIsRequired());
    }

    const USER_ENTITY: User | null = await this._userRepository.findOneBy({ email: email });
    if (!USER_ENTITY) {
      throw new NotFoundException(USER_CONSTANTS.messages.notFoundUserWithUserEmail(email));
    }

    return plainToClass(UserDto, USER_ENTITY, { excludeExtraneousValues: true });
  }

  @LogMethod
  public async validateIsAlreadyUserByEmail(email: string): Promise<void> {
    if (!email.trim()?.length) {
      throw new BadRequestException(USER_CONSTANTS.messages.emailIsRequired());
    }

    const USER_ENTITY: User | null = await this._userRepository.findOneBy({ email: email });
    if (USER_ENTITY) {
      throw new ConflictException(USER_CONSTANTS.messages.itemAlreadyExists());
    }
  }

  //#endregion
}
