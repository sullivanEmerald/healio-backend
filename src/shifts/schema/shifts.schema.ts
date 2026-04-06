import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ShiftStatus {
    PUBLISHED = 'published',
    ASSIGNED = 'assigned',
    INPROGRESS = 'inprogress',
    DRAFT = 'draft',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

@Schema({ timestamps: true })
export class Shift extends Document {
    @Prop({ index: true })
    title: string;

    @Prop({ index: true })
    state: string;

    @Prop()
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop()
    startTime: string;

    @Prop()
    endTime: string;

    @Prop({ index: true })
    shiftType: string;

    @Prop()
    numberOfCarers: number;

    @Prop()
    description: string;

    @Prop()
    skills: string;

    @Prop()
    experience: string;

    @Prop()
    genderPreference: string;

    @Prop()
    language: string;

    @Prop()
    enhancedDBS: boolean;

    @Prop()
    rightToWork: boolean;

    @Prop({ default: false })
    isReoccuringShift: boolean;

    @Prop()
    amount: string;

    @Prop()
    expenses: string;

    @Prop()
    paymentFrequency: string;

    @Prop({ index: true, type: 'ObjectId', ref: 'User' })
    providerId: string;

    @Prop({ default: null, type: 'ObjectId', ref: 'User' })
    assignedCarerId?: string;

    @Prop({ enum: ShiftStatus, default: ShiftStatus.PUBLISHED, index: true })
    status: ShiftStatus;
}

export const ShiftSchema = SchemaFactory.createForClass(Shift);

// Add compound index for efficient queries by provider and date
ShiftSchema.index({ providerId: 1, startDate: -1 });
