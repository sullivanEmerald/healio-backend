import * as crypto from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './shema/user.schema';
import { ProviderPool, ProviderPoolDocument } from 'src/provider-pool/schema/provider-pool.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(ProviderPool.name) private providerPoolModel: Model<ProviderPoolDocument>,
    ) { }

    private generateVerificationToken(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    private getVerificationTokenExpiration(): Date {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 24);
        return expiration;
    }

    async findByEmail(businessEmail: string): Promise<User | null> {
        return this.userModel.findOne({ businessEmail }).exec();
    }

    async create(userData: Partial<User>): Promise<User> {

        // generate verification token and set expiration
        userData.verificationToken = this.generateVerificationToken();
        userData.verificationTokenExpires = this.getVerificationTokenExpiration();

        const user = new this.userModel(userData);
        return user.save();
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User not found`);
        }
        return user;
    }

    async updateUser(id: string, updateData: Partial<User>): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
        if (!updatedUser) {
            throw new NotFoundException(`User not found`);
        }
        return updatedUser;
    }

    async findCarersByProvider(providerId: string): Promise<{ id: string; fullName: string; businessEmail: string }[]> {
        const providerPool = await this.providerPoolModel.findOne({ providerId }).exec();
        const carerIdsInPool = providerPool ? providerPool.carerIds : [];
        // Use $nin to exclude carers already in the pool
        const carers = await this.userModel.find({
            role: 'carer',
            _id: { $nin: carerIdsInPool }
        }).exec();
        return carers.map(carer => ({
            id: carer._id.toString(),
            fullName: `${carer.firstName} ${carer.lastName}`,
            businessEmail: carer.businessEmail,
        }));
    }
}
