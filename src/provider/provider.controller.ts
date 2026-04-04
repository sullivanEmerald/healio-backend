import { Controller, Post, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateShiftDto } from '../shifts/dto/shifts.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('provider')
export class ProviderController {
    constructor(private readonly providerService: ProviderService) { }

    @Post('shifts')
    async createShift(@Body() createShiftDto: CreateShiftDto, @Req() req: any) {
        return this.providerService.createShiftForProvider(req.user.userId, createShiftDto);
    }

    @Get('shifts')
    async getShifts(@Req() req: any) {
        const results = await this.providerService.getShiftsForProvider(req.user.userId);
        console.log("provider shifts", results);
        return results;
    }


    @Get('shifts/:id')
    async getShiftById(@Param('id') id: string, @Req() req: any) {
        return this.providerService.getShiftForProvider(req.user.userId, id);
    }

    @Post('applications/:applicationId/approve')
    async approveApplication(@Param('applicationId') applicationId: string, @Req() req: any) {
        // console.log(`Provider ${req.user.userId} is approving application ${applicationId}`);
        return this.providerService.approveApplication(req.user.userId, applicationId);
    }
}
