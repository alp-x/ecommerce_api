import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Sunucu hatası oluştu';
    let detail = null;

    // HTTP Exception kontrolü
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    // Dependency Injection hatası kontrolü
    if (exception.message && exception.message.includes("can't resolve dependencies")) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      const moduleMatch = exception.message.match(/of the (\w+) \(/);
      const dependencyMatch = exception.message.match(/argument (\w+) at index/);
      
      const module = moduleMatch ? moduleMatch[1] : 'Unknown';
      const dependency = dependencyMatch ? dependencyMatch[1] : 'Unknown';

      message = `📦 Modül Bağımlılık Hatası`;
      detail = {
        module: module,
        missingDependency: dependency,
        suggestion: `${module} modülüne ${dependency} eklenmeli. AuthModule'ü import ettiğinizden emin olun.`
      };
    }

    // MongoDB bağlantı hatası kontrolü
    if (exception.name === 'MongoConnectionError') {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = '🔌 Veritabanı Bağlantı Hatası';
      detail = 'MongoDB bağlantısı kurulamadı. Lütfen bağlantı ayarlarınızı kontrol edin.';
    }

    // Validation hatası kontrolü
    if (exception.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      message = '❌ Doğrulama Hatası';
      detail = Object.values(exception.errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));
    }

    // Hata loglanması
    this.logger.error(`${message}${detail ? ': ' + JSON.stringify(detail) : ''}`);
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug('Stack trace:', exception.stack);
    }

    // Yanıt formatı
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      message,
      detail,
      ...(process.env.NODE_ENV !== 'production' && { stack: exception.stack })
    });
  }
} 