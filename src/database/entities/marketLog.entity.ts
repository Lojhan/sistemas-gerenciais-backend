import { LogType } from 'src/helpers/log.type.enum';
import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
@Unique(['uuid'])
export class MarketLog extends BaseEntity {
  constructor(
    log: string,
    type: LogType.ACQUISITION | LogType.SOLD,
    unityValue: number,
    quantity: number,
    productUuid: string,
  ) {
    super();
    this.uuid = uuid();
    this.log = log;
    this.type = type;
    this.unityValue = unityValue;
    this.quantity = quantity;
    this.productUuid = productUuid;
  }

  @PrimaryColumn()
  uuid: string;

  @Column()
  log: string;

  @Column()
  productUuid: string;

  @Column('decimal', { precision: 5, scale: 2 })
  unityValue: number;

  @Column()
  quantity: number;

  @Column()
  type: LogType.ACQUISITION | LogType.SOLD;
}
