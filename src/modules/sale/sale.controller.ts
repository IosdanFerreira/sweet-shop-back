import { Controller, Post, Body, Get, Query, HttpStatus, UseGuards } from '@nestjs/common';
import { SaleService } from './sale.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { RegisterSaleDto } from './dto/register-sale.dto';

@ApiTags('Vendas')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Registrar venda', 
    description: 'Registra uma nova venda no sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Venda registrada com sucesso' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  registerSale(@Body() registerSaleDto: RegisterSaleDto) {
    return this.saleService.registerSale(registerSaleDto.items);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar vendas', 
    description: 'Retorna uma lista paginada de vendas com filtros' 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de itens por página' })
  @ApiQuery({ name: 'order_by', required: false, enum: ['asc', 'desc'], description: 'Ordenação dos resultados' })
  @ApiQuery({ name: 'start_date', required: false, type: String, description: 'Data inicial para filtro (YYYY-MM-DD)' })
  @ApiQuery({ name: 'end_date', required: false, type: String, description: 'Data final para filtro (YYYY-MM-DD)' })
  @ApiQuery({ name: 'exact_date', required: false, type: String, description: 'Data exata para filtro (YYYY-MM-DD)' })
  @ApiQuery({ name: 'product_name', required: false, type: String, description: 'Nome do produto para filtro' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de vendas retornada com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  GetAllSales(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order_by') orderBy: 'asc' | 'desc' = 'desc',
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('exact_date') exactDate?: string,
    @Query('product_name') productName?: string,
  ) {
    return this.saleService.getAllSales(page, limit, orderBy, startDate, endDate, exactDate, productName);
  }
}
