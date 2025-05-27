import { SetLoginHistoryDto } from '@user-application-api/modules/user/dtos/setLoginHistory.dto';

export interface ILoginHistoryService {
  setLoginHistorySuccessfully(setLoginHistoryDto: SetLoginHistoryDto): Promise<void>;

  setLoginHistoryFailed(setLoginHistoryDto: SetLoginHistoryDto): Promise<void>;
}
