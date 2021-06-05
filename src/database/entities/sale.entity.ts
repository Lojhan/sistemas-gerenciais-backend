import events from 'events';
import {
  BaseEntity,
  Column,
  Entity,
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

  @Column()
  Quantity: number;

  @Column()
  purchased: boolean;

  @ManyToOne((_type) => User, (user) => user.id, { eager: true })
  client: User;

  @OneToMany((_type) => PSSRelation, (relation) => relation, {
    eager: true,
  })
  relation: PSSRelation[];

  purchase() {
    this.purchased = true;
    events.prototype.emit('purchase', this);
    this.save();
  }
}
