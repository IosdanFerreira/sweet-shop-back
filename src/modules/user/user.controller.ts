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
  Header,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignInDto } from './dto/signin.dto';
import { isPublic } from 'src/shared/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { RefreshJwtAuthGuard } from 'src/shared/auth/guards/refresh-jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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
  @Header('Access-Control-Allow-Credentials', 'true')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar email ou senha inválidos',
  })
  @isPublic()
  @HttpCode(HttpStatus.OK)
  login(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response,) {
    return this.userService.signin(signInDto, response);
  }

  @Post('refresh')
  @isPublic()
  @UseGuards(RefreshJwtAuthGuard)
  @Header('Access-Control-Allow-Credentials', 'true')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Acesso não autorizado se o refresh token for inválido',
  })
  async refreshToken(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userService.refresh(req.user, res);
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
