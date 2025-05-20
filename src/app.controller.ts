import { GlobalResponseDto } from '@common/dtos/response-base.dto';
import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @Get('/')
  public async getHello(): Promise<GlobalResponseDto<null>> {
    return this._appService.getHello();
  }
}
