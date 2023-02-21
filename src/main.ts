import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { stream } from './utils/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev', { stream }));

  const config = new DocumentBuilder()
    .setTitle('AUTH-Microservice')
    .setDescription('authentcation microservice')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
