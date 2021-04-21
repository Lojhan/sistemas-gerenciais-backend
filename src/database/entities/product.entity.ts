import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ProductStockRelation } from './product_stock.entity';

@Entity()
@Unique(['sku', 'uuid'])
export class Product extends BaseEntity {
  constructor(
    sku: string,
    name: string,
    validity: Date,
    unity: number,
    listPrice: number,
  ) {
    super();
    this.uuid = uuid();
    this.sku = sku;
    this.name = name;
    this.validity = validity;
    this.unity = unity;
    this.listPrice = listPrice;
  }

  @PrimaryColumn()
  uuid: string;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column()
  validity: Date;

  @Column()
  unity: number;

  @Column('decimal', { precision: 5, scale: 2 })
  listPrice: number;

  @OneToMany((_type) => ProductStockRelation, (stock) => stock.product)
  stocks: ProductStockRelation[];
}
