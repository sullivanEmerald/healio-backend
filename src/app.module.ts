import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { ProviderService } from './provider/provider.service';
import { ShiftsModule } from './shifts/shifts.module';
import { ProviderModule } from './provider/provider.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    AuthModule,
    UsersModule,
    ShiftsModule,
    ProviderModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, ProviderService],
})
export class AppModule { }
