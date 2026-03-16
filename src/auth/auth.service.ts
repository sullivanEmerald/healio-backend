import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/shema/user.schema';
import { RegisterDto } from '../users/dto/register.dto';
import { LoginDto } from '../users/dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto): Promise<Record<string, any>> {
        const { businessEmail, password, ...rest } = registerDto;
        const existing = await this.userModel.findOne({ businessEmail });
        if (existing) {
            throw new ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({
            businessEmail,
            password: hashedPassword,
            ...rest,
        });
        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword;
    }

    async validateUser(businessEmail: string, password: string, role: string) {
        const user = await this.usersService.findByEmail(businessEmail);
        if (!user) throw new UnauthorizedException('Email is not associated with any account');
        if (user.role !== role) throw new UnauthorizedException('Invalid role for this account');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException('Invalid passsword');
        return user;
    }

    async login(loginDto: LoginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password, loginDto.role);
        const payload = { sub: user._id, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            access_token: token,
            user: {
                id: user._id,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.businessEmail,
                phoneNumber: user.phoneNumber,
                role: user.role,
            },
        };
    }
}
