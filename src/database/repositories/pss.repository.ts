import { EntityRepository, Repository } from 'typeorm';
import { PSSRelation } from '../entities/prod_stock_sale.entity';

@EntityRepository(PSSRelation)
export class PSSRepositoty extends Repository<PSSRelation> {}
