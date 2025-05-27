import { LogMethod } from '@common/decorators/logged-method.decorator';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SetLoginHistoryDto } from '@user-application-api/modules/login-history/dtos/setLoginHistory.dto';
import { LoginHistory } from '@user-application-api/modules/login-history/entities/login-history.entity';
import { ILoginHistoryService } from '@user-application-api/modules/login-history/services/login-history.service.interface';
import { Repository } from 'typeorm';

@Injectable()
export class LoginHistoryService implements ILoginHistoryService {
  //#region constructor and attributes

  constructor(@InjectRepository(LoginHistory) private _loginHistoryRepository: Repository<LoginHistory>) {}

  //#endregion

  //#region Public methods

  @LogMethod
  public async setLoginHistorySuccessfully(setLoginHistoryDto: SetLoginHistoryDto): Promise<void> {
    const LOGIN_HISTORY_ENTITY: LoginHistory = {
      userId: setLoginHistoryDto.userId,
      applicationId: setLoginHistoryDto.applicationId,
      ipAddress: setLoginHistoryDto.ipAddress,
      userAgent: setLoginHistoryDto.userAgent,
      loginAt: new Date(),
    };

    await this._loginHistoryRepository.save(LOGIN_HISTORY_ENTITY);
    // await this._transactionService.manager?.save(LoginHistory, LOGIN_HISTORY_ENTITY);
  }

  public async setLoginHistoryFailed(setLoginHistoryDto: SetLoginHistoryDto): Promise<void> {
    const LOGIN_HISTORY_ENTITY: LoginHistory = {
      userId: setLoginHistoryDto.userId,
      applicationId: setLoginHistoryDto.applicationId,
      ipAddress: setLoginHistoryDto.ipAddress,
      userAgent: setLoginHistoryDto.userAgent,
      success: false,
      failureReason: setLoginHistoryDto.failureReason,
      loginAt: new Date(),
    };

    await this._loginHistoryRepository.save(LOGIN_HISTORY_ENTITY);
    // await this._transactionService.manager?.save(LoginHistory, LOGIN_HISTORY_ENTITY);
  }

  //#endregion
}
