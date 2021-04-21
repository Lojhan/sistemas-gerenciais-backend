import { PartialType } from '@nestjs/mapped-types';
import { Stock } from 'src/database/entities/stock.entity';

export class CreateStorageDto extends PartialType(Stock) {}
