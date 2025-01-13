import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Cria um decorator que define se uma rota é pública
export const isPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
