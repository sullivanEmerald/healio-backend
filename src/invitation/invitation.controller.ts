import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationStatus } from './schema/invitation.schema';

@Controller('invitations')
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) { }

    @Post()
    async create(@Body() body) {
        return this.invitationService.createInvitation(body);
    }

    @Get('shift/:shiftId')
    async getByShift(@Param('shiftId') shiftId: string) {
        return this.invitationService.getInvitationsForShift(shiftId);
    }

    @Get('carer/:carerId')
    async getByCarer(@Param('carerId') carerId: string) {
        return this.invitationService.getInvitationsForCarer(carerId);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: InvitationStatus) {
        return this.invitationService.updateInvitationStatus(id, status);
    }
}
