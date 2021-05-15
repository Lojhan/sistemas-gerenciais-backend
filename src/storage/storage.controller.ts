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
import { StorageService } from './storage.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { AuthGuard } from '@nestjs/passport';
import { ValidateAsADM } from '../auth/get-user.decorator';
import { Stock } from '../database/entities/stock.entity';
import { User } from '../database/entities/user.entity';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(
    @Body('name') name: string,
    @Body('address') address: string,

    @ValidateAsADM() adm: User,
  ) {
    return this.storageService.create(new Stock(name, address), adm);
  }

  @Get()
  findAll() {
    return this.storageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storageService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStorageDto: UpdateStorageDto) {
    return this.storageService.update(+id, updateStorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storageService.remove(+id);
  }
}
