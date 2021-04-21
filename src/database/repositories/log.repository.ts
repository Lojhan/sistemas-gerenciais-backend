import { EntityRepository, Repository } from 'typeorm';
import { Log } from '../entities/log.entity';

@EntityRepository(Log)
export class LogRepositoty extends Repository<Log> {}
