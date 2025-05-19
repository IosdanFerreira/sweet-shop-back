import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { BadRequestError } from './shared/errors/types/bad-request.error';
import { DatabaseInterceptor } from './shared/errors/interceptors/database.interceptor';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { UnauthorizedExceptionFilter } from './shared/errors/exception-filters/unauthorized-exception.filter';
import { BadRequestExceptionFilter } from './shared/errors/exception-filters/bad-request-exception.filter';
import { ConflictExceptionFilter } from './shared/errors/exception-filters/conflict-exception.filter';
import { NotFoundExceptionFilter } from './shared/errors/exception-filters/not-found-exception.filter';
import helmet from 'helmet';
import { ThrottlerExceptionFilter } from './shared/errors/exception-filters/throttler-exception.filter';
import { doubleCsrfProtection } from './shared/auth/config/csrf.config';

/**
 * Function to create the Nest application instance.
 */
async function bootstrap() {
  /**
   * Create the Nest application instance.
   */
  const app = await NestFactory.create(AppModule);

  /**
   * Set up Swagger documentation.
   */
  const config = new DocumentBuilder()
    .setTitle('Sweet Shop - backend')
    .setDescription(
      'Aplicação backend construída com NestJS, projetada para gerenciar dados relacionados à docerias. Ele fornece funcionalidades para gerenciamento de usuários, permissões, produtos, categorias, fornecedores, movimentações de estoque, vendas, relatórios e fluxo de caixa.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
  /**
   * Create the Swagger document.
   */
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  /**
   * Set up the Swagger route.
   */
  SwaggerModule.setup('api', app, documentFactory);

  /**
   * Set up global filters.
   */
  app.useGlobalFilters(
    new UnauthorizedExceptionFilter(),
    new BadRequestExceptionFilter(),
    new ConflictExceptionFilter(),
    new NotFoundExceptionFilter(),
    new ThrottlerExceptionFilter(),
  );

  /**
   * Set up global interceptors.
   */
  app.useGlobalInterceptors(new DatabaseInterceptor());

  /**
   * Set up cookie parsing.
   */
  app.use(cookieParser());

  /**
   * Set up double CSRF protection.
   */
  app.use(doubleCsrfProtection);

  /**
   * Set up helmet.
   */
  app.use(helmet());

  /**
   * Set up CORS.
   */
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
  });

  /**
   * Set up global pipes.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * Exception factory.
       * @param errors List of validation errors.
       * @returns A BadRequestError instance with the validation errors.
       */
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));

        return new BadRequestError('', [...result]);
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * Start the application.
   */
  await app.listen(process.env.APP_PORT || 3001);
}
bootstrap();
