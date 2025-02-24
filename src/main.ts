import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'debug', 'log', 'verbose'],
    });

    // Global Exception Filter
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Çevre değişkenlerini kontrol et
    const requiredEnvVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Eksik çevre değişkeni: ${envVar}`);
      }
    }

    // Güvenlik önlemleri
    app.use(helmet());
    app.enableCors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    });

    // Validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
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

    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`🚀 Uygulama başlatıldı - PORT: ${port}`);
    logger.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
    logger.log(`🌍 Ortam: ${process.env.NODE_ENV}`);
  } catch (error) {
    logger.error('Uygulama başlatılırken hata oluştu:', error.message);
    if (error.stack) {
      logger.debug('Hata detayı:', error.stack);
    }
    process.exit(1);
  }
}

process.on('unhandledRejection', (reason, promise) => {
  const logger = new Logger('UnhandledRejection');
  logger.error(`🔥 İşlenmeyen Promise Reddi:`, reason);
});

process.on('uncaughtException', (error) => {
  const logger = new Logger('UncaughtException');
  logger.error(`🔥 Yakalanmayan Hata:`, error);
  process.exit(1);
});

bootstrap(); 