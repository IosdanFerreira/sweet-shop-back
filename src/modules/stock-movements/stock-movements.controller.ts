import { Controller, Post, Body, Query, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';

@ApiTags('Movimentações de Estoque')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Post('increase')
  @ApiOperation({ 
    summary: 'Entrada de estoque', 
    description: 'Registra uma entrada de produtos no estoque' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Entrada de estoque registrada com sucesso' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  createStockEntryIncrease(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.registerStockEntry(createStockMovementDto);
  }

  @Post('decrease')
  @ApiOperation({ 
    summary: 'Saída de estoque', 
    description: 'Registra uma saída de produtos do estoque' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Saída de estoque registrada com sucesso' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos ou quantidade insuficiente em estoque',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  createStockEntryDecrease(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.registerStockExit(createStockMovementDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar movimentações', 
    description: 'Retorna uma lista paginada de movimentações de estoque com filtros' 
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
    description: 'Lista de movimentações retornada com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  GetAllStockMovements(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order_by') orderBy: 'asc' | 'desc' = 'desc',
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('exact_date') exactDate?: string,
    @Query('product_name') productName?: string,
  ) {
    return this.stockMovementsService.findAllStockMovements(
      page,
      limit,
      orderBy,
      startDate,
      endDate,
      exactDate,
      productName,
    );
  }
}
