import { Controller, Get, Body, Param, Delete, Put, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { ApiResponse, ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Usuários')
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ 
    summary: 'Obter usuário logado', 
    description: 'Retorna os dados do usuário autenticado através do token JWT' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Dados do usuário retornados com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  @UseGuards(JwtAuthGuard)
  async getLoggedUser(@Request() req) {
    return await this.userService.getUserById(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar usuário por ID', 
    description: 'Retorna os dados de um usuário específico através do ID' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário encontrado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar ID de usuário inválido',
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  @UseGuards(JwtAuthGuard)
  async findUserByID(@Param('id') id: string) {
    return await this.userService.getUserById(+id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Atualizar usuário', 
    description: 'Atualiza os dados de um usuário específico' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário atualizado com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar dados inválidos',
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Excluir usuário', 
    description: 'Remove um usuário do sistema' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Usuário excluído com sucesso' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Acesso não autorizado - Token JWT inválido ou expirado' 
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar ID de usuário inválido',
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Usuário não encontrado' 
  })
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return await this.userService.deleteUser(+id);
  }
}
