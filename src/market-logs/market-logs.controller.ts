import { Controller, Get, Param } from '@nestjs/common';
import { MarketLogsService } from './market-logs.service';

@Controller('market-logs')
export class MarketLogsController {
  constructor(private readonly marketLogsService: MarketLogsService) {}

  @Get()
  findAll() {
    return this.marketLogsService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.marketLogsService.findOne(uuid);
  }

  @Get('average/:uuid')
  getAverage(@Param('uuid') uuid: string) {
    return this.marketLogsService.getAverageValue(uuid);
  }

  @Get('product/:uuid')
  getForProduct(@Param('uuid') uuid: string) {
    return this.marketLogsService.findForProduct(uuid);
  }
}
