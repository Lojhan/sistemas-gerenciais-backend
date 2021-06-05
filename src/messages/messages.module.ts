import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ProductStockRelationRepository } from 'src/database/repositories/product_repository.repository';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    // MessagesService,
    TypeOrmModule.forFeature([ProductStockRelationRepository]),
    AuthModule,
  ],
  providers: [MessagesService],
})
export class MessagesModule {}
