import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogRepositoty } from 'src/database/repositories/log.repository';
import { LogType } from 'src/helpers/log.type.enum';

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
