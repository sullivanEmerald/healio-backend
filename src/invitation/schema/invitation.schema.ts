import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InvitationDocument = Invitation & Document;

export enum InvitationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined',
    EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class Invitation {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shift', required: true, index: true })
    shiftId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    providerId: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    carerId: string;

    @Prop({ type: String, enum: InvitationStatus, default: InvitationStatus.PENDING, index: true })
    status: InvitationStatus;

    @Prop()
    message?: string;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
