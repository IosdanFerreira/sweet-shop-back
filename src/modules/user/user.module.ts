import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashProvider } from 'src/shared/providers/hash-provider';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import jwtRefreshConfig from 'src/config/jwt-refresh.config';
import { LocalStrategy } from 'src/shared/auth/strategies/local.strategy';
import { JwtStrategy } from 'src/shared/auth/strategies/jwt.strategy';
import { RefreshJwtStrategy } from 'src/shared/auth/strategies/jwt-refresh.strategy';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(jwtRefreshConfig),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'HashProviderInterface',
      useClass: HashProvider,
    },
    {
      provide: 'UserRepositoryInterface',
      useFactory: (prismaService: PrismaService) => {
        return new UserRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  exports: [UserService],
})
export class UserModule {}
