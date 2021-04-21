import { EntityRepository, Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';

@EntityRepository(Stock)
export class StockRepositoty extends Repository<Stock> {}
