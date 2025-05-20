import { ApplicationDto } from '../dtos/application.dto';

export interface IApplicationService {
  getApplicationById(applicationId: number): Promise<ApplicationDto>;

  validateIsApplicationNotFoundById(applicationId: number): Promise<void>;
}
