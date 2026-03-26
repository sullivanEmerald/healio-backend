import { Injectable } from '@nestjs/common';
import { ShiftsService } from 'src/shifts/shifts.service';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/shema/user.schema';
import { UnauthorizedException } from '@nestjs/common';
import { ApplicationService } from 'src/application/application.service';

@Injectable()
export class CarerService {
    constructor(
        private readonly shiftsService: ShiftsService,
        private readonly usersService: UsersService,
        private readonly applicationService: ApplicationService
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
}
