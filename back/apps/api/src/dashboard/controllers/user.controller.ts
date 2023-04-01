import { JwtAuthGuard } from '@domain/user/guards/jwt-auth.guard';
import { UserService } from '@domain/user/user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('dashboard/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index() {
    return await this.userService.all();
  }
}
