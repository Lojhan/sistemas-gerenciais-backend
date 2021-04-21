import { Test, TestingModule } from '@nestjs/testing';
import { MarketLogsController } from './market-logs.controller';
import { MarketLogsService } from './market-logs.service';

describe('MarketLogsController', () => {
  let controller: MarketLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketLogsController],
      providers: [MarketLogsService],
    }).compile();

    controller = module.get<MarketLogsController>(MarketLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
