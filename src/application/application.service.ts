import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument } from './schema/application.schema';
import { ApplicationStatus } from './schema/application.schema';
import { AssignmentService } from 'src/assignment/assignment.service';
import { ShiftsService } from 'src/shifts/shifts.service';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
        private readonly assignmentService: AssignmentService,
        private readonly shiftsService: ShiftsService,
    ) { }

    async createApplication(applicationData: { shiftId: string, carerId: string }) {
        const newApplication = new this.applicationModel(applicationData);
        return await newApplication.save();
    }

    async approveApplication(applicationId: string) {
        const application = await this.applicationModel.findById(applicationId);
        if (!application) {
            throw new NotFoundException('Application not found');
        }
        application.status = ApplicationStatus.APPROVED;
        await application.save();

        // Reject all other applications for this shift
        await this.applicationModel.updateMany(
            { shiftId: application.shiftId, _id: { $ne: applicationId } },
            { status: ApplicationStatus.REJECTED }
        );

        // Update the shift's assignedCarerId
        const provider = await this.shiftsService.updateShiftAssignedCarer(application.shiftId, application.carerId);

        // Create an assignment for the approved application
        await this.assignmentService.createAssignment({
            shiftId: application.shiftId,
            carerId: application.carerId,
            providerId: provider?._id.toString()
        });
    }

    async getApplicationsByCarerId(carerId: string) {
        const appliedShifts = await this.applicationModel.find({ carerId })
            .populate({
                path: 'shiftId',
                populate: { path: 'providerId', select: 'firstName lastName' }
            })
            .exec();
        const assignedShifts = await this.assignmentService.getAssignmentsByCarerId(carerId);

        return {
            appliedShifts,
            assignedShifts,
        };
    }
}
