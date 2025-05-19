import { Controller, Get, Post, Body, Param, Delete, Query, Put, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';

@ApiTags('Produtos')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar produto', 
    description: 'Cria um novo produto no sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Produto criado com sucesso' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar produtos', 
    description: 'Retorna uma lista paginada de produtos' 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de itens por página' })
  @ApiQuery({ name: 'order_by', required: false, enum: ['asc', 'desc'], description: 'Ordenação dos resultados' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Termo para busca de produtos' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de produtos retornada com sucesso' 
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
    return this.productsService.findAllProducts(page, limit, orderBy, search);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar produto por ID', 
    description: 'Retorna os dados de um produto específico' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Produto encontrado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Produto não encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findProductById(+id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Atualizar produto', 
    description: 'Atualiza os dados de um produto específico' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Produto atualizado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Produto não encontrado' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Excluir produto', 
    description: 'Remove um produto do sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Produto excluído com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Produto não encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(+id);
  }
}
