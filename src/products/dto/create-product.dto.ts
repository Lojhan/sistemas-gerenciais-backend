import { PartialType } from '@nestjs/mapped-types';
import { Product } from 'src/database/entities/product.entity';

export class CreateProductDto extends PartialType(Product) {}
