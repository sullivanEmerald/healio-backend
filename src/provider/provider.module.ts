import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { ShiftsModule } from '../shifts/shifts.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [ShiftsModule, UsersModule],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule { }
