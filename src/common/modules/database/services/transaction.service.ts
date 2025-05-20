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
  public async runTransaction<T>(callback: () => Promise<T>): Promise<T> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.startTransaction();

    try {
      const RESULT = await callback();
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

  @LogMethod
  public get manager(): EntityManager | null {
    if (this.queryRunner.hasOwnProperty('manager')) {
      return this.queryRunner?.manager;
    }

    if (this.dataSource.hasOwnProperty('manager')) {
      return this.dataSource?.manager;
    }

    return null;
  }

  //#endregion
}
