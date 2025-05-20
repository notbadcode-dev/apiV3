import { ApplicationDto } from '@modules/application/dtos/application.dto';
import { Application } from '@modules/application/entities/application.entity';
import { plainToClass } from 'class-transformer';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export class ApplicationServiceTestData {
  public static getInvalidApplicationId(): number {
    return -1;
  }

  public static getValidApplicationEntity(): Application {
    return {
      id: 1,
      name: 'Test name',
      description: 'Test description',
    };
  }

  public static getValidApplicationDto(): ApplicationDto {
    return plainToClass(ApplicationDto, this.getValidApplicationEntity(), { excludeExtraneousValues: true });
  }

  public static getFindOneByWhereWithFilteredId(): FindOptionsWhere<Application> {
    return {
      id: this.getValidApplicationEntity().id,
    };
  }
}
