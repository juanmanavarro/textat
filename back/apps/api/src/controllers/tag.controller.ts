import { TagService } from '@domain/tag/tag.service';
import { JwtAuthGuard } from '@domain/user/guards/jwt-auth.guard';
import { Controller, Get, UseGuards, Request } from '@nestjs/common';

@Controller('tags')
export class TagController {
  constructor(
    private readonly tagService: TagService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Request() req) {
    return await this.tagService.find(req.user.id);
  }
}
