import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Sale } from './sale.entity';
import { ProductStockRelation } from './product_stock.entity';

@Entity()
@Unique(['uuid'])
export class PSSRelation extends BaseEntity {
  constructor(quantity = 1, validated = false) {
    super();
    this.uuid = uuid();
    this.quantity = quantity;
    this.validated = validated;
  }

  @PrimaryColumn()
  uuid: string;

  @Column()
  quantity: number;

  @Column()
  validated: boolean;

  @Column('decimal', { precision: 5, scale: 2 })
  priceAtTime: number;

  @ManyToOne((type) => ProductStockRelation, (psRelation) => psRelation.uuid, {
    eager: true,
  })
  psRelation: ProductStockRelation;

  @ManyToOne((type) => Sale, (sale) => sale.uuid, {
    primary: true,
  })
  sale: Sale;
}
