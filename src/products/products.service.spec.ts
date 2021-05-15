import { Test } from '@nestjs/testing';
import { ProductRepository } from '../database/repositories/product.repository';
import { ProductsService } from './products.service';
import { LogRepositoty } from '../database/repositories/log.repository';
import { ProductStockRelationRepository } from '../database/repositories/product_repository.repository';
import { StockRepositoty } from '../database/repositories/stock.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from '../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { v4 as uuid } from 'uuid';
import { User } from '../database/entities/user.entity';

const mockRepository = () => ({
  finOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductRepository, useFactory: mockRepository },
        { provide: LogRepositoty, useFactory: mockRepository },
        { provide: ProductStockRelationRepository, useFactory: mockRepository },
        { provide: StockRepositoty, useFactory: mockRepository },
        { provide: getModelToken('Fiscal'), useValue: mockRepository },
      ],
    }).compile();

    productsService = await module.get<ProductsService>(ProductsService);
    productsRepository = await module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
  });

  it('gets all products from the repository', async () => {
    productsRepository.find.mockResolvedValue([]);

    const result = await productsService.getAll();
    expect(productsRepository.find).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
