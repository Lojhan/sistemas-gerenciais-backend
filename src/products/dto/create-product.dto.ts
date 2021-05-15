import { PartialType } from '@nestjs/mapped-types';
import { Product } from '../../database/entities/product.entity';

export class CreateProductDto extends PartialType(Product) {}
