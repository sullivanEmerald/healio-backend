import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ShiftsService } from '../shifts/shifts.service';
import { CreateShiftDto } from '../shifts/dto/shifts.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/shema/user.schema';
import { ApplicationService } from 'src/application/application.service';



@Injectable()
export class ProviderService {
    constructor(
        private readonly shiftsService: ShiftsService,
        private readonly usersService: UsersService,
        private readonly applicationService: ApplicationService,
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
        return this.shiftsService.findShiftsByProvider(providerId);
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
}
