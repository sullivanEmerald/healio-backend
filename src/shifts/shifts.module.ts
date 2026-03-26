import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { Shift, ShiftSchema } from './schema/shifts.schema';
import { ApplicationModule } from 'src/application/application.module';
import { Application, ApplicationSchema } from 'src/application/schema/application.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shift.name, schema: ShiftSchema },
      { name: Application.name, schema: ApplicationSchema }, // <-- Add this line
    ]),
    ApplicationModule,
  ],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService],
})
export class ShiftsModule { }
