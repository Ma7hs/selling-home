/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthController } from './user/auth/auth.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { HomeModule } from './home/home.module';
import { UserInterceptor } from './user/interceptors/user.interceptor';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController, AuthController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor
    }
  ],
  exports : [UserModule]
})
export class AppModule {}
