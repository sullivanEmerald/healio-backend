import { Module } from '@nestjs/common';
import { ProviderPoolController } from './provider-pool.controller';
import { ProviderPoolService } from './provider-pool.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderPool, ProviderPoolSchema } from './schema/provider-pool.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProviderPool.name, schema: ProviderPoolSchema }]), UsersModule],
  controllers: [ProviderPoolController],
  providers: [ProviderPoolService]
})
export class ProviderPoolModule { }
