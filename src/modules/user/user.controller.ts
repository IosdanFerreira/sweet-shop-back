import { Controller, Get, Body, Param, Delete, Put, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return await this.userService.getUserById(req.user.id);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Acesso não autorizado' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar ID de usuário inválido',
  })
  @UseGuards(JwtAuthGuard)
  async findUserByID(@Param('id') id: string) {
    return await this.userService.getUserById(+id);
  }

  @Put(':id')
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Acesso não autorizado' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar ID de usuário inválido',
  })
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Acesso não autorizado' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar ID de usuário inválido',
  })
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return await this.userService.deleteUser(+id);
  }
}
