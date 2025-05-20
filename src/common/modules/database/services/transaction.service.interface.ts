import { EntityManager } from 'typeorm';

export interface ITransactionService {
  runTransaction<T>(callback: () => Promise<T>): Promise<T>;

  get manager(): EntityManager;
}
