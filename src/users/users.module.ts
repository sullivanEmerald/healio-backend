import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './shema/user.schema';
import { UsersController } from './users.controller';
import { ProviderPoolModule } from 'src/provider-pool/provider-pool.module';
import { ProviderPool, ProviderPoolSchema } from 'src/provider-pool/schema/provider-pool.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ProviderPool.name, schema: ProviderPoolSchema },
    ]),
    forwardRef(() => ProviderPoolModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, MongooseModule],
})
export class UsersModule { }
