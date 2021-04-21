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
@Unique(['uuid'])
export class Stock extends BaseEntity {
  constructor(name: string, address: string) {
    super();
    this.uuid = uuid();
    this.name = name;
    this.address = address;
  }

  @PrimaryColumn()
  uuid: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @OneToMany((_type) => ProductStockRelation, (product) => product.stock)
  products: ProductStockRelation[];
}
