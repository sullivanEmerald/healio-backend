import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment, AssignmentDocument } from './schema/assignment.schema';

@Injectable()
export class AssignmentService {
    constructor(
        @InjectModel(Assignment.name) private assignmentModel: Model<AssignmentDocument>,
    ) { }

    async createAssignment(assignmentData: { shiftId: string, carerId: string, providerId: string | undefined }) {
        const newAssignment = new this.assignmentModel(assignmentData);
        return await newAssignment.save();
    }
}
