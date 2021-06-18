import * as events from 'events';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { PSSRelation } from './prod_stock_sale.entity';
import { User } from './user.entity';

@Entity()
@Unique(['uuid'])
export class Sale extends BaseEntity {
  constructor() {
    super();
    this.uuid = uuid();
    this.purchased = false;
  }

  @PrimaryColumn()
  uuid: string;

  @ManyToOne((_type) => User, (user) => user.id, { eager: true })
  client: User;

  @OneToMany((_type) => PSSRelation, (relation) => relation)
  relation: PSSRelation[];

  @Column()
  purchased: boolean;

  @Column()
  paymentTicket: string;

  async purchase() {
    this.purchased = true;
    events.prototype.emit('purchase', this);
    await this.save();
  }
}
