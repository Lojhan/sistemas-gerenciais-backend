import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from '../database/entities/log.entity';
import { User } from '../database/entities/user.entity';
import { LogRepositoty } from '../database/repositories/log.repository';
import { ProductStockRelationRepository } from '../database/repositories/product_repository.repository';
import { StockRepositoty } from '../database/repositories/stock.repository';
import { LogType } from '../helpers/log.type.enum';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(LogRepositoty)
    private logRepositoty: LogRepositoty,
    @InjectRepository(ProductStockRelationRepository)
    private productStockRelationRepository: ProductStockRelationRepository,
    @InjectRepository(StockRepositoty)
    private stockRepository: StockRepositoty,
  ) {}

  create(storage: CreateStorageDto, user: User) {
    storage.save();
    const log = new Log(
      `new product (${storage.uuid}) created by ${user.username} (${user.id})`,
      LogType.STORAGE_CREATED,
    );
    log.save();
    return storage;
  }

  findAll() {
    return this.stockRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} storage`;
  }

  update(id: number, updateStorageDto: UpdateStorageDto) {
    return `This action updates a #${id} storage`;
  }

  remove(id: number) {
    return `This action removes a #${id} storage`;
  }
}
