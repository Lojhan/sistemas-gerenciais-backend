import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import * as events from 'events';
import { Model } from 'mongoose';
import { PSSRelation } from 'src/database/entities/prod_stock_sale.entity';
import { Sale } from 'src/database/entities/sale.entity';
import { PSSRepositoty } from 'src/database/repositories/pss.repository';
import { Log } from '../database/entities/log.entity';
import { ProductStockRelation } from '../database/entities/product_stock.entity';
import { User } from '../database/entities/user.entity';
import { LogRepositoty } from '../database/repositories/log.repository';
import { ProductRepository } from '../database/repositories/product.repository';
import { ProductStockRelationRepository } from '../database/repositories/product_repository.repository';
import { StockRepositoty } from '../database/repositories/stock.repository';
import { Fiscal, FiscalDocument } from '../database/schemas/fiscal.schema';
import { LogType } from '../helpers/log.type.enum';
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
    @InjectRepository(PSSRepositoty)
    private pssRepositoty: PSSRepositoty,
    @InjectRepository(StockRepositoty)
    private stockRepository: StockRepositoty,
    @InjectModel(Fiscal.name) private fiscalSchema: Model<FiscalDocument>,
  ) {
    events.prototype.on('purchase', (data) => {
      this.handlePurchase(data);
      //
    });
  }

  async handlePurchase(data: Sale) {
    data.relation = await this.pssRepositoty.find({
      where: { sale: { uuid: data.uuid } },
    });

    console.log(data.relation);

    let total = 0;
    data?.relation?.forEach((e) => {
      total += e.quantity + e.quantity;
    });

    console.log(total);

    data.relation.forEach((relation) => {
      this.changeQuantityFromStorage(
        relation.psRelation.product.uuid,
        relation.psRelation.stock.uuid,
        -total,
        LogType.SOLD,
        relation.priceAtTime,
        {},
      );
    });
  }

  remove(uuid: number) {
    return this.productRepository.delete(uuid);
  }

  async getOne(uuid: string) {
    return await this.productStockRelationRepository.findOne({
      where: { uuid },
    });
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
    products.forEach(
      (product) => (totalValue = +totalValue + +product.inStockValue),
    );
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
    aditionalData: { [key: string]: any },
  ) {
    return await this.productStockRelationRepository.changeQuantityFromStorage(
      productUuid,
      stockUuid,
      delta,
      reason,
      unityPrice,
      aditionalData,
    );
  }

  async transferStorage(
    productUuid: string,
    originStockUuid: string,
    targetStockUuid: string,
    delta: number,
    targetInStockValue: number,
  ) {
    return await this.productStockRelationRepository.transferStorage(
      productUuid,
      originStockUuid,
      targetStockUuid,
      delta,
      targetInStockValue,
    );
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

  async getFiscal(id: string) {
    const data: { [key: string]: any } = {};

    data.schema = await this.fiscalSchema.findById(id);

    data.log = await this.logRepositoty.findOne({
      where: { fiscal: data.schema.id },
    });
    if (data.schema.data.stockUuid) {
      data.stock = await this.stockRepository.findOne({
        where: { uuid: data.schema.data.stockUuid },
      });
    }
    if (data.schema.data.productUuid) {
      data.product = await this.productRepository.findOne({
        where: { uuid: data.schema.data.productUuid },
      });
    }
    console.log(data);
    return data;
  }
}
