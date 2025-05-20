import { ArgumentException } from '@common/exceptions/argument.exception';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

import { IApplicationService } from './application.service.interface';
import { APPLICATION_CONSTANTS } from '../constants/application.constants';
import { ApplicationDto } from '../dtos/application.dto';
import { Application } from '../entities/application.entity';

@Injectable()
export class ApplicationService implements IApplicationService {
  //#region constructor and attributes

  constructor(@InjectRepository(Application) private readonly _applicationRepository: Repository<Application>) {}

  //#endregion

  //#region public methods

  public async getApplicationById(applicationId: number): Promise<ApplicationDto> {
    if (!applicationId || applicationId < 0) {
      throw new ArgumentException(APPLICATION_CONSTANTS.messages.notFoundApplicationWithApplicationId(applicationId));
    }

    const APPLICATION: Application | null = await this._applicationRepository.findOneBy({ id: applicationId });
    if (!APPLICATION) {
      throw new NotFoundException(APPLICATION_CONSTANTS.messages.notFoundApplicationWithApplicationId(applicationId));
    }

    const APPLICATION_DTO: ApplicationDto = plainToClass(ApplicationDto, APPLICATION, {
      excludeExtraneousValues: true,
    });

    return APPLICATION_DTO;
  }

  public async validateIsApplicationNotFoundById(applicationId: number): Promise<void> {
    if (!applicationId || applicationId < 0) {
      throw new ArgumentException(APPLICATION_CONSTANTS.messages.notFoundApplicationWithApplicationId(applicationId));
    }

    await this.getApplicationById(applicationId);
  }

  //#endregion
}
