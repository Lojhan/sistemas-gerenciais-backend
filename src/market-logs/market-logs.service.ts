import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MarketLogRepository } from '../database/repositories/marketlog.repository';

@Injectable()
export class MarketLogsService {
  constructor(
    @InjectRepository(MarketLogRepository)
    private marketLogRepository: MarketLogRepository,
  ) {}

  findAll() {
    return this.marketLogRepository.find();
  }

  findOne(uuid: string) {
    return this.marketLogRepository.find({ where: { uuid } });
  }

  findForProduct(uuid: string) {
    return this.marketLogRepository.find({ where: { productUuid: uuid } });
  }

  async getAverageValue(uuid: string) {
    let totalValue = 0;
    let totalProducts = 0;
    const logs = await this.marketLogRepository.find({
      where: { productUuid: uuid },
    });

    logs.forEach((log) => {
      totalValue = totalValue + log.quantity * log.unityValue;
      totalProducts = totalProducts + log.quantity;
    });
    return totalValue / totalProducts;
  }
}
