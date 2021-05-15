import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { LogRepositoty } from '../database/repositories/log.repository';
import { ProductStockRelationRepository } from '../database/repositories/product_repository.repository';
import { StockRepositoty } from '../database/repositories/stock.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LogRepositoty,
      StockRepositoty,
      ProductStockRelationRepository,
    ]),
    AuthModule,
  ],
  controllers: [StorageController],
  providers: [StorageService],
})
export class StorageModule {}
