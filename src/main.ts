import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { BadRequestError } from './shared/errors/types/bad-request.error';
import { BadRequestInterceptor } from './shared/errors/interceptors/bad-request.interceptor';
import { ConflictInterceptor } from './shared/errors/interceptors/conflict.interceptor';
import { DatabaseInterceptor } from './shared/errors/interceptors/database.interceptor';
import { NestFactory } from '@nestjs/core';
import { NotFoundInterceptor } from './shared/errors/interceptors/not-found.interceptor';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // Cria uma instância do Nest
  const app = await NestFactory.create(AppModule);

  // Configura o Swagger
  const config = new DocumentBuilder()
    .setTitle('Sweet Shop - backend')
    .setDescription(
      'Aplicação backend construída com NestJS, projetada para gerenciar dados relacionados à docerias. Ele fornece funcionalidades para gerenciamento de usuários, permissões, produtos, categorias, fornecedores, movimentações de estoque, vendas, relatórios e fluxo de caixa.',
    )
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Intercepta os erros lançados na aplicação para exibi-los de forma customizada
  app.useGlobalInterceptors(
    new BadRequestInterceptor(),
    new ConflictInterceptor(),
    new NotFoundInterceptor(),
    new DatabaseInterceptor(),
  );

  app.use(cookieParser());
  app.enableCors({
    origin: [
      "http://localhost:3001",
    ],
    credentials: true,
  });

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

  await app.listen(process.env.APP_PORT || 3001);
}
bootstrap();
