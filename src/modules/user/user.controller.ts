import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDto } from './dto/signin.dto';
import { isPublic } from 'src/shared/decorators/is-public.decorator';
import { RefreshJwtAuthGuard } from 'src/shared/auth/guards/refresh-jwt-auth.guard';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Erro ao tentar criar um novo usuário com um email ja existente',
  })
  @isPublic()
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar email ou senha inválidos',
  })
  @isPublic()
  @HttpCode(HttpStatus.OK)
  login(@Body() signInDto: SignInDto) {
    return this.userService.signin(signInDto);
  }

  @Post('refreshToken')
  @ApiBearerAuth('refresh-token')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer <refresh_token>',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Acesso não autorizado se o refresh token for inválido',
  })
  @isPublic()
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtAuthGuard)
  async refreshToken(@Request() req: any) {
    return this.userService.refresh(req.user);
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Acesso não autorizado' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar ID de usuário inválido',
  })
  @UseGuards(JwtAuthGuard)
  findUserByID(@Param('id') id: string) {
    return this.userService.getUserById(+id);
  }

  @Put(':id')
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Acesso não autorizado' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar ID de usuário inválido',
  })
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Acesso não autorizado' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar ID de usuário inválido',
  })
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
