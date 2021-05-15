import { Controller, Get, Param } from '@nestjs/common';
import { LogType } from '../helpers/log.type.enum';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  findAll() {
    return this.logsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logsService.findOne(id);
  }

  @Get('/type/:type')
  findbyType(@Param('type') type: LogType) {
    return this.logsService.findByType(type);
  }
}
