import { Module } from '@nestjs/common';
import { MarketLogsService } from './market-logs.service';
import { MarketLogsController } from './market-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { LogRepositoty } from '../database/repositories/log.repository';
import { ProductStockRelationRepository } from '../database/repositories/product_repository.repository';
import { MarketLogRepository } from '../database/repositories/marketlog.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LogRepositoty,
      MarketLogRepository,
      ProductStockRelationRepository,
    ]),
    AuthModule,
  ],
  controllers: [MarketLogsController],
  providers: [MarketLogsService],
})
export class MarketLogsModule {}
