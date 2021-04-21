import { Test, TestingModule } from '@nestjs/testing';
import { MarketLogsService } from './market-logs.service';

describe('MarketLogsService', () => {
  let service: MarketLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketLogsService],
    }).compile();

    service = module.get<MarketLogsService>(MarketLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
