import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/shared/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import jwtRefreshConfig from 'src/shared/config/jwt-refresh.config';
import { JwtStrategy } from 'src/shared/auth/strategies/jwt.strategy';
import { RefreshJwtStrategy } from 'src/shared/auth/strategies/jwt-refresh.strategy';
import { RemoveAccentsInterface } from 'src/shared/interfaces/remove-accents.interface';
import { SharedModule } from 'src/shared/modules/shared-module.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(jwtRefreshConfig),
    SharedModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
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
  exports: [UserService],
})
export class UserModule { }
