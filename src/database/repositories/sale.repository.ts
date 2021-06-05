import { EntityRepository, Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';

@EntityRepository(Sale)
export class SaleRepository extends Repository<Sale> {}
