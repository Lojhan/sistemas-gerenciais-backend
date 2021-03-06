import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Render,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';
import { ValidateAsADM } from '../auth/get-user.decorator';
import { User } from '../database/entities/user.entity';
import { LogType } from '../helpers/log.type.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from '../database/entities/product.entity';

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
  getAll() {
    return this.productsService.getAllfromRelations();
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    return await this.productsService.getOne(id);
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
    @Body('aditional_data') aditionalData: { [key: string]: any },
    @ValidateAsADM() adm: User,
  ) {
    this.productsService.changeQuantityFromStorage(
      productUuid,
      stockUuid,
      delta,
      reason,
      unityPrice,
      aditionalData,
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

  @Get('fiscal/:id')
  @Render('fiscal')
  async root(@Param('id') id: string) {
    const data = await this.productsService.getFiscal(id);
    console.log(data);
    return {
      schema: data.schema,
      time: new Date(Date.now()).toLocaleString('pt-BR'),
      log: data.log,
      product: data.product,
      stock: data.stock,
      total: +data.schema.data.delta * +data.schema.data.unityPrice,
    };
  }
}
