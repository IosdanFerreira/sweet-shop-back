import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestInterceptor } from './shared/interceptors/bad-request.interceptor';
import { ConflictInterceptor } from './shared/interceptors/conflict.interceptor';
import { NotFoundInterceptor } from './shared/interceptors/not-found.interceptor';
import { BadRequestError } from './shared/errors/bad-request.error';

async function bootstrap() {
  // Cria uma instância do Nest
  const app = await NestFactory.create(AppModule);

  // Intercepta os erros lançados na aplicação para exibi-los de forma customizada
  app.useGlobalInterceptors(
    new BadRequestInterceptor(),
    new ConflictInterceptor(),
    new NotFoundInterceptor(),
  );

  // Intercepta erros de validação de dados para exibi-los de forma customizada
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));

        return new BadRequestError([...result]);
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3001);
}
bootstrap();
