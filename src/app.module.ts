import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { StorageModule } from './storage/storage.module';
import { LogsModule } from './logs/logs.module';
import { MarketLogsModule } from './market-logs/market-logs.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ProductsModule,
    StorageModule,
    LogsModule,
    MarketLogsModule,
  ],
})
export class AppModule {}
