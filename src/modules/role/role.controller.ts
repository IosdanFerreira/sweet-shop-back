import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';

@ApiTags('Papéis')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar papel', 
    description: 'Cria um novo papel/permissão no sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Papel criado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Erro ao tentar criar permissão já existente' 
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar papéis', 
    description: 'Retorna a lista de todos os papéis/permissões' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de papéis retornada com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  findAll() {
    return this.roleService.findAllRoles();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar papel por ID', 
    description: 'Retorna os dados de um papel/permissão específico' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Papel encontrado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Papel não encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  findOne(@Param('id') id: string) {
    return this.roleService.findRoleById(+id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Atualizar papel', 
    description: 'Atualiza os dados de um papel/permissão específico' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Papel atualizado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Papel não encontrado' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Excluir papel', 
    description: 'Remove um papel/permissão do sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Papel excluído com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Papel não encontrado' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  remove(@Param('id') id: string) {
    return this.roleService.deleteRole(+id);
  }
}
