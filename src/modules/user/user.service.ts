import { CachedUserRepository } from '@modules/user/cached-user.respository';
import { EntityNotFoundException } from '@common/exceptions';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from '@modules/user/dto/register.dto';
import { User } from '@modules/user/models/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: CachedUserRepository) {}

  public async register(dto: RegisterDto): Promise<User> {
    // TODO: Notify worker to send verification mail
    return this.userRepository.create({
      email: dto.email,
      password: dto.password,
    });
  }

  public async findById(uid: string): Promise<User> {
    const user = await this.userRepository.findById(uid);
    if (user === null) {
      throw new EntityNotFoundException(User.name);
    }

    return user;
  }
}
