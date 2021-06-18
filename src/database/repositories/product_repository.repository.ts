import { Connection, Model, Mongoose } from 'mongoose';
import { LogType } from 'src/helpers/log.type.enum';
import { EntityRepository, Repository } from 'typeorm';
import { Log } from '../entities/log.entity';
import { MarketLog } from '../entities/marketLog.entity';
import { ProductStockRelation } from '../entities/product_stock.entity';
import { Fiscal, FiscalDocument, FiscalSchema } from '../schemas/fiscal.schema';
import { v4 as uuid } from 'uuid';
import { StockRepositoty } from './stock.repository';
import { InternalServerErrorException } from '@nestjs/common';
import { ProductRepository } from './product.repository';

@EntityRepository(ProductStockRelation)
export class ProductStockRelationRepository extends Repository<ProductStockRelation> {
  private connection;

  private stockRepository = new StockRepositoty();
  private productRepository = new ProductRepository();
  private mongoose: Mongoose = new Mongoose({});

  constructor() {
    super();
    this.mongoose.connect(
      'mongodb+srv://root:1234@cluster0.szknf.mongodb.net/Cluster0?retryWrites=true"',
    );
  }

  async changeQuantityFromStorage(
    productUuid: string,
    stockUuid: string,
    delta: number,
    reason: LogType,
    unityPrice: number,
    aditionalData: { [key: string]: any },
  ) {
    console.log(productUuid, stockUuid);
    const relation = await this.findOne({
      where: { product: productUuid, stock: stockUuid },
    });

    console.log(relation);

    const schema = await this.mongoose
      .model(Fiscal.name, FiscalSchema)
      .create({});

    schema.set('data', {
      name: uuid(),
      ...aditionalData,
    });

    schema.save();

    relation.quantity = relation.quantity + Number(delta);
    relation.validated = false;
    relation.inStockValue = unityPrice;

    console.log(relation);
    const log = new Log(
      `product: ${productUuid} | stock: ${stockUuid} | delta: ${delta}`,
      reason,
    );

    log.fiscal = schema.id;

    if ([LogType.ACQUISITION, LogType.SOLD].includes(reason)) {
      const marketLog = new MarketLog(
        `produto ${reason === LogType.ACQUISITION ? 'comprado' : 'vendido'}`,
        reason as LogType.ACQUISITION | LogType.SOLD,
        unityPrice ||
          (
            await this.findOne({
              where: { product: productUuid, stock: stockUuid },
            })
          ).inStockValue,
        Math.abs(delta),
        productUuid,
      );
      marketLog.save();
    }
    relation.save();
    log.save();

    return relation;
  }

  async transferStorage(
    productUuid: string,
    originStockUuid: string,
    targetStockUuid: string,
    delta: number,
    targetInStockValue: number,
  ) {
    const origin = await this.findOne({
      where: { product: productUuid, stock: originStockUuid },
    });

    origin.quantity = origin.quantity - Number(delta);
    if (origin.quantity < 0)
      throw new InternalServerErrorException('Quantidade não permitida');

    origin.validated = false;
    origin.save();

    const schema = await this.mongoose
      .model(Fiscal.name, FiscalSchema)
      .create({});

    schema.set('data', {
      name: uuid(),
      productUuid,
      originStockUuid,
      targetStockUuid,
      delta,
      targetInStockValue,
    });

    schema.save();

    let target = await this.findOne({
      where: {
        stock: await this.stockRepository.findOne(targetStockUuid),
        product: await this.productRepository.findOne(productUuid),
      },
    });

    if (target === undefined) {
      target = this.create({
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
}
