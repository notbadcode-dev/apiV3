import { APP_CONSTANTS } from '@common/constants/app.constants';
import { LogMethod } from '@common/decorators/logged-method.decorator';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

@Injectable()
export class TransactionService {
  //#region constructor and attributes

  private queryRunner!: QueryRunner;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  //#endregion

  //#region Public methods

  @LogMethod
  public async runTransaction<T>(callback: (manager: EntityManager) => Promise<T>): Promise<T> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const RESULT = await callback(this.queryRunner.manager);
      await this.queryRunner.commitTransaction();
      return RESULT;
    } catch (error) {
      if (error instanceof Error) {
        await this.queryRunner.rollbackTransaction();
      }
      throw new InternalServerErrorException(APP_CONSTANTS.message.dataBaseQueryFailed());
    } finally {
      await this.queryRunner.release();
    }
  }

  //#endregion
}
