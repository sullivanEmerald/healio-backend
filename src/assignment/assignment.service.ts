import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment, AssignmentDocument } from './schema/assignment.schema';
import { AssignmentStatus } from './schema/assignment.schema';

@Injectable()
export class AssignmentService {
    constructor(
        @InjectModel(Assignment.name) private assignmentModel: Model<AssignmentDocument>,
    ) { }

    async createAssignment(assignmentData: { shiftId: string, carerId: string, providerId: string | undefined }) {
        const newAssignment = new this.assignmentModel(assignmentData);
        return await newAssignment.save();
    }


    async getAssignmentsByCarerId(carerId: string) {
        return await this.assignmentModel.find({ carerId })
            .populate({
                path: 'shiftId',
                populate: { path: 'providerId', select: 'firstName lastName' }
            })
            .exec();
    }

    async startShiftNow(assignmentId: string) {
        const assignment = await this.assignmentModel.findById(assignmentId);
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        assignment.status = AssignmentStatus.INPROGRESS;
        assignment.startedAt = new Date();
        await assignment.save();
        return assignment;
    }

    async completeShiftNow(assignmentId: string) {
        const assignment = await this.assignmentModel.findById(assignmentId);
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        assignment.status = AssignmentStatus.COMPLETED;
        assignment.completedAt = new Date();
        await assignment.save();
        return assignment;
    }

    async getAssignmentsByProvider(providerId: string) {
        return await this.assignmentModel.find({ providerId })
            .populate({
                path: 'shiftId',
                populate: { path: 'providerId', select: 'firstName lastName' }
            })
            .populate({
                path: 'carerId',
                select: 'firstName lastName'
            })
            .exec();
    }

    async reviewAssignment(assignmentId: string) {
        const assignment = await this.assignmentModel.findById(assignmentId);
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        assignment.status = AssignmentStatus.REVIEWED;
        await assignment.save();
        return HttpStatus.OK;
    }
}
