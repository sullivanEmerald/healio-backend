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

    @Get('my-shifts')
    async getMyShifts(@Req() req: any) {
        return this.carerService.getMyShifts(req.user.userId);
    }

    @Post('start-shift/:assignmentId')
    async startShift(@Req() req: any, @Param('assignmentId') assignmentId: string) {
        return this.carerService.startShift(req.user.userId, assignmentId);
    }

    @Post('complete-shift/:assignmentId')
    async completeShift(@Req() req: any, @Param('assignmentId') assignmentId: string) {
        console.log(`Carer ${req.user.userId} is completing shift ${assignmentId}`);
        return this.carerService.completeShift(req.user.userId, assignmentId);
    }
}
