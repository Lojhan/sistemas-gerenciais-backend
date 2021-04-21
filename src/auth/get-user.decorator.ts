import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../database/entities/user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    console.log(req);
    return req.user;
  },
);

export const ValidateAsADM = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();

    if (req.user.type != 'adm')
      throw new UnauthorizedException(
        'Essa rota é apenas para administradores',
      );
    return req.user;
  },
);
