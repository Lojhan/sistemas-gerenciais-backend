/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { StorageModule } from './storage/storage.module';
import { LogsModule } from './logs/logs.module';
import { MarketLogsModule } from './market-logs/market-logs.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(
      'mongodb+srv://root:1234@cluster0.szknf.mongodb.net/Cluster0?retryWrites=true"',
      {
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          return connection;
        },
      },
    ),
    ProductsModule,
    StorageModule,
    LogsModule,
    MarketLogsModule,
  ],
})
export class AppModule {}
