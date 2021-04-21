import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductRepository } from 'src/database/repositories/product.repository';
import { ProductStockRelationRepository } from 'src/database/repositories/product_repository.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LogRepositoty } from 'src/database/repositories/log.repository';
import { StockRepositoty } from 'src/database/repositories/stock.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRepository,
      LogRepositoty,
      StockRepositoty,
      ProductStockRelationRepository,
    ]),
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
