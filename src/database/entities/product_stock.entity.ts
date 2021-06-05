import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { Stock } from './stock.entity';
import { v4 as uuid } from 'uuid';
import { Sale } from './sale.entity';
import { PSSRelation } from './prod_stock_sale.entity';

@Entity()
@Unique('relation', ['stock', 'product'])
export class ProductStockRelation extends BaseEntity {
  constructor(
    stock: Stock,
    product: Product,
    quantity = 0,
    validated = false,
    inStockValue: number,
  ) {
    super();
    this.uuid = uuid();
    this.stock = stock;
    this.product = product;
    this.quantity = quantity;
    this.validated = validated;
    this.inStockValue = inStockValue;
  }

  @Column()
  uuid: string;

  @Column()
  quantity: number;

  @Column()
  validated: boolean;

  @Column('decimal', { precision: 8, scale: 2 })
  inStockValue: number;

  @OneToMany((type) => PSSRelation, (pssRelation) => pssRelation.uuid)
  sales: PSSRelation[];

  @ManyToOne((type) => Stock, (stock) => stock, { eager: true, primary: true })
  stock: Stock;

  @ManyToOne((type) => Product, (product) => product, {
    eager: true,
    primary: true,
  })
  product: Product;
}
