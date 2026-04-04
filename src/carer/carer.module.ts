import { Module } from '@nestjs/common';
import { CarerService } from './carer.service';
import { ShiftsModule } from 'src/shifts/shifts.module';
import { UsersModule } from 'src/users/users.module';
import { ApplicationModule } from 'src/application/application.module';
import { AssignmentModule } from 'src/assignment/assignment.module';

@Module({
  imports: [ShiftsModule, UsersModule, ApplicationModule, AssignmentModule],
  providers: [CarerService],
  exports: [CarerService],

})
export class CarerModule { }
