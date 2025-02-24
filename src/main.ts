import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Güvenlik önlemleri
  app.use(helmet());
  app.enableCors();

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger dokümantasyonu
  const config = new DocumentBuilder()
    .setTitle('E-ticaret API')
    .setDescription('Modern E-ticaret Platformu API Dokümantasyonu')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Rate limiting ve diğer güvenlik önlemleri burada eklenecek

  await app.listen(3000);
}
bootstrap(); 