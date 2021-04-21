import { BaseEntity, Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Product } from './product.entity';
import { Stock } from './stock.entity';

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
    this.stock = stock;
    this.product = product;
    this.quantity = quantity;
    this.validated = validated;
    this.inStockValue = inStockValue;
  }

  @Column()
  quantity: number;

  @Column()
  validated: boolean;

  @Column('decimal', { precision: 8, scale: 2 })
  inStockValue: number;

  @ManyToOne((type) => Stock, (stock) => stock, { eager: true, primary: true })
  stock: Stock;

  @ManyToOne((type) => Product, (product) => product, {
    eager: true,
    primary: true,
  })
  product: Product;
}
