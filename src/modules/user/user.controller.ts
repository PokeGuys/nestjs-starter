import { Controller, Get, Param } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/responses/user.dto';
import { UserParam } from './dto/user.param';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  public async getUser(@Param() param: UserParam): Promise<UserDto> {
    const user = await this.userService.findById(param.userId);

    return user.toDto();
  }
}
