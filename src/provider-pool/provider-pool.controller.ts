import { Controller, Get, Post, UseGuards, Param, Req } from '@nestjs/common';
import { ProviderPoolService } from './provider-pool.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProviderGuard } from '../auth/guards/provider.guard';


@Controller('provider-pool')
@UseGuards(JwtAuthGuard, ProviderGuard)
export class ProviderPoolController {
    constructor(private readonly providerPoolService: ProviderPoolService) { }

    @Post('carers/:carerId')
    async addCarerToPool(@Param('carerId') carerId: string, @Req() req: any) {
        return this.providerPoolService.addCarerToPool(carerId, req.user.userId);
    }
}
