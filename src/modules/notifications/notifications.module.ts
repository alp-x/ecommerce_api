import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get('JWT_EXPIRATION', '24h') 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [NotificationsGateway, NotificationsService, WsJwtGuard],
  exports: [NotificationsService]
})
export class NotificationsModule {} 