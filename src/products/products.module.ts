import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from '../database/repositories/product.repository';
import { ProductStockRelationRepository } from '../database/repositories/product_repository.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { LogRepositoty } from '../database/repositories/log.repository';
import { StockRepositoty } from '../database/repositories/stock.repository';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Fiscal, FiscalSchema } from '../database/schemas/fiscal.schema';
import { PSSRepositoty } from 'src/database/repositories/pss.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRepository,
      LogRepositoty,
      StockRepositoty,
      ProductStockRelationRepository,
      PSSRepositoty,
    ]),
    MongooseModule.forFeature([{ name: Fiscal.name, schema: FiscalSchema }]),
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
