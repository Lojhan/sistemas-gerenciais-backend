import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../../auth/dto/auth-credentials.dto';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password, type } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const user = new User(
      username,
      await this.hashPassoword(password, salt),
      salt,
      type,
    );

    try {
      await user.save();
    } catch (err) {
      if (err.code == 23505)
        throw new ConflictException('Username already exists');
      else throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<User> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({ username });

    if (await user.validatePassword(password)) {
      return user;
    } else {
      return null;
    }
  }

  private async hashPassoword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
