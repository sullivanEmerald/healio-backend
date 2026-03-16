import { Injectable } from '@nestjs/common';
import { ShiftsService } from 'src/shifts/shifts.service';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/shema/user.schema';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class CarerService {
    constructor(
        private readonly shiftsService: ShiftsService,
        private readonly usersService: UsersService,
    ) { }
    async getMarketplace(userId: string) {
        const carer = await this.usersService.findById(userId);
        if (!carer || carer.role !== UserRole.CARER) {
            throw new UnauthorizedException('Only healio carers can access the marketplace');
        }

        return this.shiftsService.getAllShifts(); // null means get all shifts regardless of provider
    }
}
