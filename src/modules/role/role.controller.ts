import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Acesso não autorizado' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Erro ao tentar criar permissão já existente' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAllRoles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findRoleById(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.deleteRole(+id);
  }
}
