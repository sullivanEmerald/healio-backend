import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        const userId = req.user.userId;
        const user = await this.usersService.findById(userId);
        return {
            id: user?._id,
            fullName: `${user?.firstName} ${user?.lastName}`,
            email: user?.businessEmail,
            role: user?.role,
            isVerified: user?.isVerified
        };
    }
}
