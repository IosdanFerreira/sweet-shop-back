import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepository } from '../user/repositories/user.repository';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { JwtStrategy } from 'src/shared/auth/strategies/jwt.strategy';
import { RefreshJwtStrategy } from 'src/shared/auth/strategies/jwt-refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/shared/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from 'src/shared/modules/shared-module.module';
import jwtRefreshConfig from 'src/shared/config/jwt-refresh.config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(jwtRefreshConfig),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: 'UserRepositoryInterface',
      useFactory: (prismaService: PrismaService, removeAccents: RemoveAccentsInterface) => {
        return new UserRepository(prismaService, removeAccents);
      },
      inject: [PrismaService, 'RemoveAccentsInterface'],
    },
    JwtStrategy,
    RefreshJwtStrategy,
  ],
})
export class AuthModule {}
