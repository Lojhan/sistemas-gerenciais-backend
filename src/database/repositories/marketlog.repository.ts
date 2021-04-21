import { EntityRepository, Repository } from 'typeorm';
import { Log } from '../entities/log.entity';
import { MarketLog } from '../entities/marketLog.entity';

@EntityRepository(MarketLog)
export class MarketLogRepository extends Repository<MarketLog> {}
