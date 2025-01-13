import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

// Exporta uma configuração nomeada 'jwt' que retorna as opções do módulo JWT
export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    // Define a chave de segurança do token de acesso
    secret: process.env.JWT_SECRET,
    signOptions: {
      // Define o tempo de expiração do token de acesso
      expiresIn: process.env.JWT_EXPIRES_IN,
    },
  }),
);
