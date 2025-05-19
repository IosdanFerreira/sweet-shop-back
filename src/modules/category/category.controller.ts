import { Controller, Get, Post, Body, Param, Delete, Query, Put, HttpStatus, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';

@ApiTags('Categorias')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar categoria', 
    description: 'Cria uma nova categoria no sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Categoria criada com sucesso' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar categorias', 
    description: 'Retorna uma lista paginada de categorias' 
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de itens por página' })
  @ApiQuery({ name: 'order_by', required: false, enum: ['asc', 'desc'], description: 'Ordenação dos resultados' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Termo para busca de categorias' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de categorias retornada com sucesso' 
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
    return this.categoryService.findAllCategories(page, limit, orderBy, search);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar categoria por ID', 
    description: 'Retorna os dados de uma categoria específica' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Categoria encontrada com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Categoria não encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  findOne(@Param('id') id: string) {
    return this.categoryService.findCategoryById(+id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Atualizar categoria', 
    description: 'Atualiza os dados de uma categoria específica' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Categoria atualizada com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Categoria não encontrada' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Excluir categoria', 
    description: 'Remove uma categoria do sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Categoria excluída com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Categoria não encontrada' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  remove(@Param('id') id: string) {
    return this.categoryService.deleteCategory(+id);
  }
}
