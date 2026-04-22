import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ShiftsService } from '../shifts/shifts.service';
import { CreateShiftDto } from '../shifts/dto/shifts.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/shema/user.schema';
import { ApplicationService } from 'src/application/application.service';
import { AssignmentService } from 'src/assignment/assignment.service';



@Injectable()
export class ProviderService {
    constructor(
        private readonly shiftsService: ShiftsService,
        private readonly usersService: UsersService,
        private readonly applicationService: ApplicationService,
        private readonly assignmentService: AssignmentService,
    ) { }

    async createShiftForProvider(providerId: string, createShiftDto: CreateShiftDto) {
        // Validate provider
        const provider = await this.usersService.findById(providerId);
        if (!provider || provider.role !== UserRole.PROVIDER) {
            throw new UnauthorizedException('Only providers can create shifts');
        }

        return this.shiftsService.createShift(createShiftDto, providerId);
    }

    async getShiftsForProvider(providerId: string) {
        const provider = await this.usersService.findById(providerId);
        if (!provider || provider.role !== UserRole.PROVIDER) {
            throw new UnauthorizedException('Only providers can access their shifts');
        }
        // Get all shifts created by the provider
        const shifts = await this.shiftsService.findShiftsByProvider(providerId);
        // Get all assignments for this provider
        const assignments = await this.assignmentService.getAssignmentsByProvider(providerId);
        return {
            shifts,
            assignments,
        };
    }

    async getShiftForProvider(providerId: string, shiftId: string) {
        const provider = await this.usersService.findById(providerId);
        if (!provider || provider.role !== UserRole.PROVIDER) {
            throw new UnauthorizedException('Only providers can access their shifts');
        }
        return this.shiftsService.findShiftById(shiftId);
    }

    async approveApplication(userId, applicationId) {
        const provider = await this.usersService.findById(userId);
        if (!provider || provider.role !== UserRole.PROVIDER) {
            throw new UnauthorizedException('Only providers can access their shifts');
        }
        return this.applicationService.approveApplication(applicationId);
    }

    async reviewAssignment(userId, assignmentId) {
        const provider = await this.usersService.findById(userId);
        if (!provider || provider.role !== UserRole.PROVIDER) {
            throw new UnauthorizedException('Only providers can access their shifts');
        }
        return this.assignmentService.reviewAssignment(assignmentId);
    }

    async updateShiftForProvider(providerId: string, shiftId: string, updateShiftDto: CreateShiftDto) {
        const provider = await this.usersService.findById(providerId);
        if (!provider || provider.role !== UserRole.PROVIDER) {
            throw new UnauthorizedException('Only providers can update their shifts');
        }
        return this.shiftsService.updateShift(shiftId, updateShiftDto);
    }

    async saveDraftShift(providerId: string, draftId: string, saveDraftDto: Partial<CreateShiftDto>) {
        const provider = await this.usersService.findById(providerId);
        if (!provider || provider.role !== UserRole.PROVIDER) {
            throw new UnauthorizedException('Only providers can save draft shifts');
        }
        return this.shiftsService.saveDraftShift(saveDraftDto, providerId, draftId);
    }

    async getDraftShift(providerId: string, shiftId: string) {
        const provider = await this.usersService.findById(providerId);
        if (!provider || provider.role !== UserRole.PROVIDER) {
            throw new UnauthorizedException('Only providers can access their draft shifts');
        }
        return this.shiftsService.findDraftShiftById(shiftId);
    }
}