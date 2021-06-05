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
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';
import * as events from 'events';

@Entity()
export class Interest extends BaseEntity {
  constructor(user: User, product: Product) {
    super();
    this.user = user;
    this.product = product;
  }

  @ManyToOne((type) => Product, (product) => product, {
    eager: true,
    primary: true,
  })
  product: Product;

  @ManyToOne((type) => User, (user) => user, {
    eager: true,
    primary: true,
  })
  user: User;

  notifyUser() {
    events.prototype.emit('interest', this);
  }
}
