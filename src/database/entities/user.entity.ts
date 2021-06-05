import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Sale } from './sale.entity';

@Entity()
@Unique(['username', 'id'])
export class User extends BaseEntity {
  constructor(username: string, password: string, salt: string, type: string) {
    super();

    this.username = username;
    this.password = password;
    this.salt = salt;
    this.type = type;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  type: string;

  @OneToMany((_type) => Sale, (sale) => sale)
  stocks: Sale[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash == this.password;
  }
}
