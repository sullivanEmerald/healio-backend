import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { ShiftsModule } from '../shifts/shifts.module';
import { UsersModule } from '../users/users.module';
import { ApplicationModule } from 'src/application/application.module';
import { AssignmentModule } from 'src/assignment/assignment.module';

@Module({
  imports: [ShiftsModule, UsersModule, ApplicationModule, AssignmentModule],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule { }
