import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LogRepositoty } from 'src/database/repositories/log.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LogRepositoty]), AuthModule],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
