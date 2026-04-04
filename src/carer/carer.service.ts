import { Injectable } from '@nestjs/common';
import { ShiftsService } from 'src/shifts/shifts.service';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/shema/user.schema';
import { UnauthorizedException } from '@nestjs/common';
import { ApplicationService } from 'src/application/application.service';
import { AssignmentService } from 'src/assignment/assignment.service';

@Injectable()
export class CarerService {
    constructor(
        private readonly shiftsService: ShiftsService,
        private readonly usersService: UsersService,
        private readonly applicationService: ApplicationService,
        private readonly assignmentService: AssignmentService,
    ) { }
    async getMarketplace(userId: string, filters: any) {
        const carer = await this.usersService.findById(userId);
        if (!carer || carer.role !== UserRole.CARER) {
            throw new UnauthorizedException('Only healio carers can access the marketplace');
        }

        return await this.shiftsService.getAllShifts(filters, userId); // null means get all shifts regardless of provider

    }

    async applyForShift(userId: string, shiftId: string) {
        const carer = await this.usersService.findById(userId);
        if (!carer || carer.role !== UserRole.CARER) {
            throw new UnauthorizedException('Only healio carers can apply for shifts');
        }

        return await this.applicationService.createApplication({
            shiftId,
            carerId: userId,
        });
    }

    async getMyShifts(userId: string) {
        const carer = await this.usersService.findById(userId);
        if (!carer || carer.role !== UserRole.CARER) {
            throw new UnauthorizedException('Only healio carers can access their shifts');
        }

        return await this.applicationService.getApplicationsByCarerId(userId);
    }

    async startShift(userId: string, assignmentId: string) {
        const carer = await this.usersService.findById(userId);
        if (!carer || carer.role !== UserRole.CARER) {
            throw new UnauthorizedException('Only healio carers can start shifts');
        }

        return await this.assignmentService.startShiftNow(assignmentId);
    }


    async completeShift(userId: string, assignmentId: string) {
        const carer = await this.usersService.findById(userId);
        if (!carer || carer.role !== UserRole.CARER) {
            throw new UnauthorizedException('Only healio carers can complete shifts');
        }

        return await this.assignmentService.completeShiftNow(assignmentId);
    }
}