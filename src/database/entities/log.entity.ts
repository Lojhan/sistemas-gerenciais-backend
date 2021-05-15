import { LogType } from '../../helpers/log.type.enum';
import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
@Unique(['uuid'])
export class Log extends BaseEntity {
  constructor(log: string, type: LogType) {
    super();
    this.uuid = uuid();
    this.log = log;
    this.type = type;
  }

  @PrimaryColumn()
  uuid: string;

  @Column()
  log: string;

  @Column()
  fiscal: string;

  @Column()
  type: LogType;
}
