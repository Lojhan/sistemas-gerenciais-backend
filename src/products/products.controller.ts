import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { ValidateAsADM } from '../auth/get-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { LogType } from 'src/helpers/log.type.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from 'src/database/entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('/storage/transfer')
  @UseGuards(AuthGuard())
  async transferStorage(
    @Body('product_uuid') productUuid: string,
    @Body('origin_uuid') originUuid: string,
    @Body('target_uuid') targetUuid: string,
    @Body('delta') delta: number,
    @Body('value') targetInStockValue: number,
    @ValidateAsADM() adm: User,
  ) {
    await this.productsService.transferStorage(
      productUuid,
      originUuid,
      targetUuid,
      delta,
      targetInStockValue,
    );
  }

  @Get('/:id/average')
  @UseGuards(AuthGuard())
  getAverageValue(@Param('id') id: string) {
    return this.productsService.getAverageValue(id);
  }

  @Get('')
  @UseGuards(AuthGuard())
  getAll() {
    return this.productsService.getAllfromRelations();
  }

  @Get('/raw')
  @UseGuards(AuthGuard())
  getAllRaw() {
    return this.productsService.getAll();
  }

  @Post('/storage/change_quantity')
  @UseGuards(AuthGuard())
  changeQuantityFromStorage(
    @Body('product_uuid') productUuid: string,
    @Body('stock_uuid') stockUuid: string,
    @Body('delta') delta: number,
    @Body('reason') reason: LogType,
    @Body('unity_price') unityPrice: number,
    @ValidateAsADM() adm: User,
  ) {
    this.productsService.changeQuantityFromStorage(
      productUuid,
      stockUuid,
      delta,
      reason,
      unityPrice,
    );
  }

  @Post('/storage/check_quantity')
  @UseGuards(AuthGuard())
  checkQuantity(
    @Body('product_uuid') productUuid: string,
    @Body('stock_uuid') stockUuid: string,
    @ValidateAsADM() adm: User,
  ) {
    this.productsService.checkQuantity(productUuid, stockUuid, adm);
  }

  @Post()
  @UseGuards(AuthGuard())
  create(
    @Body('sku') sku: string,
    @Body('name') name: string,
    @Body('validity') validity: Date,
    @Body('unity') unity: number,
    @Body('list_price') listPrice: number,
    @ValidateAsADM() adm: User,
  ) {
    this.productsService.create(
      new Product(sku, name, validity, unity, listPrice),
      adm,
    );
  }

  @Post('/storage/edit_in_storage')
  @UseGuards(AuthGuard())
  updateStorageData(
    @Body('quantity') quantity: number,
    @Body('in_stock_price') inStockPrice: number,
    @Body('stock_uuid') targetStorageUuid: string,
    @Body('product_uuid') targetProductUuid: string,
    @ValidateAsADM() user: User,
  ) {
    this.productsService.updateStorageData(
      quantity,
      inStockPrice,
      targetStorageUuid,
      targetProductUuid,
      user,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string, @ValidateAsADM() user: User) {
    return this.productsService.remove(+id);
  }
}
