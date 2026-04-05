import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AssignmentDocument = Assignment & Document;

export enum AssignmentStatus {
  ASSIGNED = 'assigned',
  INPROGRESS = 'in-progress',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
}

@Schema({ timestamps: true })
export class Assignment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shift', required: true, index: true })
  shiftId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  providerId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  carerId: string;

  @Prop({ type: String, enum: AssignmentStatus, default: AssignmentStatus.ASSIGNED, index: true })
  status: AssignmentStatus;

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
