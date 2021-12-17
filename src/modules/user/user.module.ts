import { CachedUserRepository } from '@modules/user/cached-user.respository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RedisModule } from '@libraries/redis';
import { User } from '@modules/user/models/user.entity';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User]), RedisModule],
  controllers: [UserController],
  providers: [UserService, CachedUserRepository],
  exports: [UserService],
})
export class UserModule {}
