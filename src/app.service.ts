import { APP_CONSTANTS } from '@common/constants/app.constants';
import { LogMethod } from '@common/decorators/logged-method.decorator';
import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { GlobalResponseService } from '@common/utils/global-response.service';
import { Injectable } from '@nestjs/common';

import { IAppService } from './app.service.interface';

@Injectable()
export class AppService implements IAppService {
  //#region Public methods

  @LogMethod
  public async getHello(): Promise<GlobalResponseDto<null>> {
    return GlobalResponseService.getSuccessfullyGlobalResponse(null, APP_CONSTANTS.configuration.getHello);
  }

  //#endregion
}
