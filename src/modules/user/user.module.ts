import { RedisModule } from '@libraries/redis';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CachedUserRepository } from '@modules/user/cached-user.respository';
import { User } from '@modules/user/models/user.entity';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MikroOrmModule.forFeature([User]), RedisModule],
  controllers: [UserController],
  providers: [UserService, CachedUserRepository],
  exports: [UserService],
})
export class UserModule {}
