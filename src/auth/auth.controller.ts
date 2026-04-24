import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/users/dto/register.dto';
import { LoginDto } from 'src/users/dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ProviderOrCarerGuard } from './guards/providerOrCarer.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    // I will allow both providers and carers to change their password, so I will use a combined guard that checks for either role
    @UseGuards(JwtAuthGuard, ProviderOrCarerGuard)
    @Post('change-password')
    async changePassword(@Body() changePasswordDto: { currentPassword: string, newPassword: string }, @Req() req: any) {
        return this.authService.changePassword(req.user.userId, changePasswordDto.currentPassword, changePasswordDto.newPassword);
    }
}
