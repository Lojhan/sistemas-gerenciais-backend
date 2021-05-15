import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogRepositoty } from '../database/repositories/log.repository';
import { LogType } from '../helpers/log.type.enum';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(LogRepositoty)
    private logRepositoty: LogRepositoty,
  ) {}
  async findAll() {
    return await this.logRepositoty.find();
  }

  async findByType(type: LogType) {
    return await this.logRepositoty.find({ where: { type } });
  }

  findOne(uuid: string) {
    return this.logRepositoty.findOne(uuid);
  }
}
