import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invitation, InvitationDocument, InvitationStatus } from './schema/invitation.schema';

@Injectable()
export class InvitationService {
    constructor(
        @InjectModel(Invitation.name) private invitationModel: Model<InvitationDocument>,
    ) { }

    async createInvitation(data: Partial<Invitation>): Promise<Invitation> {
        const invitation = new this.invitationModel(data);
        return invitation.save();
    }

    async getInvitationsForShift(shiftId: string): Promise<Invitation[]> {
        return this.invitationModel.find({ shiftId }).exec();
    }

    async getInvitationsForCarer(carerId: string): Promise<Invitation[]> {
        return this.invitationModel.find({ carerId }).exec();
    }

    async updateInvitationStatus(invitationId: string, status: InvitationStatus): Promise<Invitation | null> {
        return this.invitationModel.findByIdAndUpdate(invitationId, { status }, { new: true }).exec();
    }
}
