import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LogRepositoty } from 'src/database/repositories/log.repository';
import { ProductStockRelationRepository } from 'src/database/repositories/product_repository.repository';
import { StockRepositoty } from 'src/database/repositories/stock.repository';

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
