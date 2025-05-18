import { Body, Controller, Get, Header, HttpCode, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { isPublic } from 'src/shared/decorators/is-public.decorator';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { RefreshJwtAuthGuard } from 'src/shared/auth/guards/refresh-jwt-auth.guard';
import { generateCsrfToken } from 'src/shared/auth/config/csrf.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Route that creates a new user
  @Post('signup')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Erro ao tentar criar um novo usuário com um email ja existente',
  })
  @isPublic()
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signUpDto: SignUpDto) {
    return await this.authService.signup(signUpDto);
  }

  // Route that performs the login
  @Post('login')
  @Header('Access-Control-Allow-Credentials', 'true')
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Erro ao informar email ou senha inválidos',
  })
  @isPublic()
  @HttpCode(HttpStatus.OK)
  async login(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response) {
    return await this.authService.signin(signInDto, response);
  }

  // Route that performs the logout
  @Post('logout')
  @isPublic()
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.signout(res);
  }

  // Route that generate a new access token
  @Post('refresh')
  @isPublic()
  @UseGuards(RefreshJwtAuthGuard)
  @Header('Access-Control-Allow-Credentials', 'true')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Acesso não autorizado se o refresh token for inválido',
  })
  async refreshToken(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    return await this.authService.refresh(req.user, res);
  }

  // Route that generate a CRSF token
  @Get('csrf-token')
  getCsrfToken(@Request() req, @Res() res: Response) {
    const token = generateCsrfToken(req, res);
    return res.json({ csrfToken: token });
  }
}
