import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from 'src/database/entities/log.entity';
import { MarketLog } from 'src/database/entities/marketLog.entity';
import { ProductStockRelation } from 'src/database/entities/product_stock.entity';
import { User } from 'src/database/entities/user.entity';
import { LogRepositoty } from 'src/database/repositories/log.repository';
import { ProductRepository } from 'src/database/repositories/product.repository';
import { ProductStockRelationRepository } from 'src/database/repositories/product_repository.repository';
import { StockRepositoty } from 'src/database/repositories/stock.repository';
import { LogType } from 'src/helpers/log.type.enum';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    @InjectRepository(LogRepositoty)
    private logRepositoty: LogRepositoty,
    @InjectRepository(ProductStockRelationRepository)
    private productStockRelationRepository: ProductStockRelationRepository,
    @InjectRepository(StockRepositoty)
    private stockRepository: StockRepositoty,
  ) {}

  remove(uuid: number) {
    return this.productRepository.delete(uuid);
  }

  create(product: CreateProductDto, user: User) {
    product.save();
    const log = new Log(
      `new product (${product.uuid}) created by ${user.username} (${user.id})`,
      LogType.PRODUCT_CREATED,
    );
    log.save();
    return product;
  }

  async getAllfromRelations() {
    return await this.productStockRelationRepository.find();
  }

  async getAll() {
    return await this.productRepository.find();
  }

  async getAverageValue(uuid: string) {
    let totalValue = 0;
    const products = await this.productStockRelationRepository.find({
      where: { product: uuid },
    });
    products.forEach((product) => {
      console.log(product.inStockValue);
      totalValue = +totalValue + +product.inStockValue;
    });
    return totalValue / products.length;
  }

  async checkQuantity(productUuid: string, stockUuid: string, user: User) {
    const relation = await this.productStockRelationRepository.findOne({
      where: { product: productUuid, stock: stockUuid },
    });
    relation.validated = true;
    const log = new Log(
      `product: ${productUuid} | stock: ${stockUuid} | checked by: ${user.username} (${user.id})`,
      LogType.QUANTITY_CHECKED,
    );
    log.save();
    return await relation.save();
  }

  async changeQuantityFromStorage(
    productUuid: string,
    stockUuid: string,
    delta: number,
    reason: LogType,
    unityPrice: number,
  ) {
    const relation = await this.productStockRelationRepository.findOne({
      where: { product: productUuid, stock: stockUuid },
    });
    relation.quantity = relation.quantity + Number(delta);
    relation.validated = false;
    relation.inStockValue = unityPrice;
    const log = new Log(
      `product: ${productUuid} | stock: ${stockUuid} | delta: ${delta}`,
      reason,
    );

    if ([LogType.ACQUISITION, LogType.SOLD].includes(reason)) {
      const marketLog = new MarketLog(
        `produto ${reason === LogType.ACQUISITION ? 'comprado' : 'vendido'}`,
        reason as LogType.ACQUISITION | LogType.SOLD,
        unityPrice ||
          (
            await this.productStockRelationRepository.findOne({
              where: { product: productUuid, stock: stockUuid },
            })
          ).inStockValue,
        Math.abs(delta),
        productUuid,
      );
      marketLog.save();
    }

    log.save();
    return await relation.save();
  }

  async transferStorage(
    productUuid: string,
    originStockUuid: string,
    targetStockUuid: string,
    delta: number,
    targetInStockValue: number,
  ) {
    const origin = await this.productStockRelationRepository.findOne({
      where: { product: productUuid, stock: originStockUuid },
    });

    origin.quantity = origin.quantity - Number(delta);
    if (origin.quantity < 0)
      throw new InternalServerErrorException('Quantidade não permitida');

    origin.validated = false;
    origin.save();

    let target = await this.productStockRelationRepository.findOne({
      where: {
        stock: await this.stockRepository.findOne(targetStockUuid),
        product: await this.productRepository.findOne(productUuid),
      },
    });

    if (target === undefined) {
      target = this.productStockRelationRepository.create({
        stock: await this.stockRepository.findOne(targetStockUuid),
        product: await this.productRepository.findOne(productUuid),
      });
    }

    target.quantity = +target.quantity + Number(delta);
    target.validated = false;
    target.inStockValue = targetInStockValue || target.product.listPrice;
    target.save();

    const log = new Log(
      `product ${productUuid} moved from ${originStockUuid} to ${targetStockUuid}`,
      LogType.TRANSFER,
    );
    log.save();

    return { origin, target, log };
  }

  async updateStorageData(
    quantity: number,
    inStockPrice: number,
    targetStorageUuid: string,
    targetProductUuid: string,
    user: User,
  ) {
    let relation = await this.productStockRelationRepository.findOne({
      where: { product: targetProductUuid, stock: targetStorageUuid },
    });

    if (relation === undefined) {
      relation = new ProductStockRelation(
        await this.stockRepository.findOne(targetStorageUuid),
        await this.productRepository.findOne(targetProductUuid),
        0,
        true,
        0,
      );
    }
    relation.quantity = quantity;
    relation.inStockValue = inStockPrice;
    relation.validated = true;

    const log = new Log(
      `product: ${targetProductUuid} | stock: ${targetStorageUuid} | modified by: ${user.username} (${user.id})`,
      LogType.ADM_ADJUST,
    );
    log.save();
    return await relation.save();
  }
}
