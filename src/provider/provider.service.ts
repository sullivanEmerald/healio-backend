import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ShiftsService } from '../shifts/shifts.service';
import { CreateShiftDto } from '../shifts/dto/shifts.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/shema/user.schema';

@Injectable()
export class ProviderService {
    constructor(
        private readonly shiftsService: ShiftsService,
        private readonly usersService: UsersService,
    ) { }

    async createShiftForProvider(providerId: string, createShiftDto: CreateShiftDto) {
        // Validate provider
        const provider = await this.usersService.findById(providerId);
        if (!provider || provider.role !== UserRole.PROVIDER) {
            throw new UnauthorizedException('Only providers can create shifts');
        }

        console.log(createShiftDto)
        return this.shiftsService.createShift(createShiftDto, providerId);
    }
}
