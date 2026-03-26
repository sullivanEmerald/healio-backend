import { Controller, Get, Req, UseGuards, Query, Post, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CarerGuard } from '../auth/guards/carer.guard';
import { CarerService } from './carer.service';

@UseGuards(JwtAuthGuard, CarerGuard)
@Controller('carer')
export class CarerController {
    constructor(private readonly carerService: CarerService) { }

    @Get('marketplace')
    async getMarketplace(@Query() filters: any, @Req() req: any) {
        console.log(filters);
        return this.carerService.getMarketplace(req.user.userId, filters);
    }

    @Post('apply/:shiftId')
    async applyForShift(@Req() req: any, @Param('shiftId') shiftId: string) {
        console.log(`Carer ${req.user.userId} is applying for shift ${shiftId}`);
        return this.carerService.applyForShift(req.user.userId, shiftId);
    }
}
