import { Module } from '@nestjs/common';
import { MarketLogsService } from './market-logs.service';
import { MarketLogsController } from './market-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LogRepositoty } from 'src/database/repositories/log.repository';
import { ProductStockRelationRepository } from 'src/database/repositories/product_repository.repository';
import { MarketLogRepository } from 'src/database/repositories/marketlog.repository';

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
