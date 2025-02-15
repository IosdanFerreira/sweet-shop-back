import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestError } from './shared/errors/types/bad-request.error';
import { BadRequestInterceptor } from './shared/errors/interceptors/bad-request.interceptor';
import { ConflictInterceptor } from './shared/errors/interceptors/conflict.interceptor';
import { NotFoundInterceptor } from './shared/errors/interceptors/not-found.interceptor';
import { DatabaseInterceptor } from './shared/errors/interceptors/database.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Cria uma instância do Nest
  const app = await NestFactory.create(AppModule);

  // Configura o Swagger
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
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
