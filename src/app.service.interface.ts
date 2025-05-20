import { GlobalResponseDto } from '@common/dtos/response-base.dto';

export interface IAppService {
  getHello(): Promise<GlobalResponseDto<null>>;
}
