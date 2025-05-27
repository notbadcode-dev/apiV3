import { SetLoginHistoryDto } from '@user-application-api/modules/login-history/dtos/setLoginHistory.dto';

export interface ILoginHistoryService {
  setLoginHistorySuccessfully(setLoginHistoryDto: SetLoginHistoryDto): Promise<void>;

  setLoginHistoryFailed(setLoginHistoryDto: SetLoginHistoryDto): Promise<void>;
}
