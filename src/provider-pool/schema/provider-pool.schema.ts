import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProviderPoolDocument = ProviderPool & Document;

@Schema({ timestamps: true })
export class ProviderPool {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Provider', required: true, index: true })
    providerId: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
    carerIds: string[];
}

export const ProviderPoolSchema = SchemaFactory.createForClass(ProviderPool);
