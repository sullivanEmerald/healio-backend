import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProviderPool, ProviderPoolDocument } from './schema/provider-pool.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProviderPoolService {
    constructor(
        @InjectModel(ProviderPool.name) private providerPoolModel: Model<ProviderPoolDocument>,
        private usersService: UsersService,
    ) { }
    async addCarerToPool(carerId: string, providerId: string) {
        try {
            const [provider, carer] = await Promise.all([
                this.usersService.findById(providerId),
                this.usersService.findById(carerId)
            ]);
            if (!provider || !carer) {
                throw new NotFoundException('Provider or Carer not found');
            }
            const providerPool = await this.providerPoolModel.findOne({ providerId });
            if (providerPool) {
                providerPool.carerIds.push(carerId);
                await providerPool.save();
            } else {
                await this.providerPoolModel.create({ providerId, carerIds: [carerId] });
            }
            return HttpStatus.OK;
        } catch (error) {
            throw new Error('Error adding carer to provider pool');
        }
    }
}
