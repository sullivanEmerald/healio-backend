import { Module, forwardRef } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { ShiftsModule } from '../shifts/shifts.module';
import { UsersModule } from '../users/users.module';
import { ApplicationModule } from 'src/application/application.module';
import { AssignmentModule } from 'src/assignment/assignment.module';
import { ProviderPoolModule } from 'src/provider-pool/provider-pool.module';
import { InvitationModule } from 'src/invitation/invitation.module';

@Module({
  imports: [
    ShiftsModule,
    UsersModule,
    ApplicationModule,
    AssignmentModule,
    forwardRef(() => ProviderPoolModule),
    InvitationModule
  ],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule { }
