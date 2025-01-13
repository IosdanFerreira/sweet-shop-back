// NestJS
import { Injectable } from '@nestjs/common';
// Password
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshJwtAuthGuard extends AuthGuard('refresh-jwt') {}
