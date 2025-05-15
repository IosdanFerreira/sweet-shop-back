import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

// Exporta uma configuração nomeada 'refresh-jwt' que retorna as opções do módulo JWT para o refresh-token
export default registerAs(
  'jwt-refresh',
  (): JwtSignOptions => ({
    // Define a chave de segurança do refresh-token
    secret: process.env.REFRESH_JWT_SECRET,
    // Define o tempo de expiração do refresh-token
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN_LITERAL_STRING_VALUE,
  }),
);
