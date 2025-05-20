import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { TransactionService } from './services/transaction.service';

dotenv.config({
  path: path.resolve(__dirname, `../../../../environment/.env.${process.env.NODE_ENV || 'local'}`),
});

const TYPE_ORM_MODULE: DynamicModule = TypeOrmModule.forRoot({
  type: 'mariadb',

  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  charset: 'utf8mb4',
  retryAttempts: 3,
  retryDelay: 3000,
  autoLoadEntities: true,
  synchronize: false,
});

@Module({
  imports: [ConfigModule, TYPE_ORM_MODULE],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class DatabaseModule {}
