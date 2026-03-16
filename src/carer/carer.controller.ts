import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CarerService } from './carer.service';

@UseGuards(JwtAuthGuard)
@Controller('carer')
export class CarerController {
    constructor(private readonly carerService: CarerService) { }

    @Get('marketplace')
    async getMarketplace(@Req() req: any) {
        console.log('CarerController.getMarketplace called with userId:', req.user.userId);
        return this.carerService.getMarketplace(req.user.userId);
    }
}
