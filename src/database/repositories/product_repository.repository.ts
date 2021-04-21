import { EntityRepository, Repository } from 'typeorm';
import { ProductStockRelation } from '../entities/product_stock.entity';

@EntityRepository(ProductStockRelation)
export class ProductStockRelationRepository extends Repository<ProductStockRelation> {}
