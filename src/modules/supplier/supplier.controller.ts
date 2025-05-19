import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';

@ApiTags('Fornecedores')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar fornecedor', 
    description: 'Cria um novo fornecedor no sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Fornecedor criado com sucesso' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.createSupplier(createSupplierDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar fornecedores', 
    description: 'Retorna uma lista paginada de fornecedores' 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de itens por página' })
  @ApiQuery({ name: 'order_by', required: false, enum: ['asc', 'desc'], description: 'Ordenação dos resultados' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Termo para busca de fornecedores' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de fornecedores retornada com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order_by') orderBy: 'asc' | 'desc' = 'desc',
    @Query('search') search?: string,
  ) {
    return this.supplierService.findAllSuppliers(page, limit, orderBy, search);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar fornecedor por ID', 
    description: 'Retorna os dados de um fornecedor específico' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Fornecedor encontrado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Fornecedor não encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  findOne(@Param('id') id: string) {
    return this.supplierService.findSupplierById(+id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Atualizar fornecedor', 
    description: 'Atualiza os dados de um fornecedor específico' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Fornecedor atualizado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Fornecedor não encontrado' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.supplierService.updateSupplier(+id, updateSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Excluir fornecedor', 
    description: 'Remove um fornecedor do sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Fornecedor excluído com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Fornecedor não encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  remove(@Param('id') id: string) {
    return this.supplierService.deleteSupplier(+id);
  }
}
