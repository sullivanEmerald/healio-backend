import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ApplicationDocument = Application & Document;

export enum ApplicationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Application {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shift', required: true, index: true })
    shiftId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    carerId: string;

    @Prop({ type: String, enum: ApplicationStatus, default: ApplicationStatus.PENDING, index: true })
    status: ApplicationStatus;

    @Prop()
    message?: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

// Prevent duplicate applications per carer per shift
ApplicationSchema.index({ shiftId: 1, carerId: 1 }, { unique: true });
