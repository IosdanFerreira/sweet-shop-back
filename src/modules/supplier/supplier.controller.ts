import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.createSupplier(createSupplierDto);
  }

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order_by') orderBy: 'asc' | 'desc' = 'desc',
    @Query('search') search?: string,
  ) {
    return this.supplierService.findAllSuppliers(page, limit, orderBy, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findSupplierById(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.updateSupplier(+id, updateSupplierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierService.deleteSupplier(+id);
  }
}
