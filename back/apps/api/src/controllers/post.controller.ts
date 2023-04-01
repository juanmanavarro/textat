import { CategoryService } from '@domain/category/category.service';
import { PostService } from '@domain/post/post.service';
import { JwtAuthGuard } from '@domain/user/guards/jwt-auth.guard';
import { Body, Controller, Delete, Get, Param, Put, Query, Request, UseGuards } from '@nestjs/common';
import { TransportService } from '@transport/transport';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly categoryService: CategoryService,
    private readonly transportService: TransportService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Request() req, @Query() query) {
    const findQuery = {
      user_id: req.user.id,
      ...query,
    };

    return await this.postService.find(findQuery);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/reactions')
  async reactions(@Request() req) {
    return await this.postService.categories({ user_id: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/scheduled')
  async scheduled(@Request() req) {
    return await this.postService.findScheduled(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/dates')
  async dates(@Request() req) {
    return await this.postService.dates({ user_id: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async edit(@Param() { id }, @Body() body, @Request() req) {
    const category = await this.categoryService.firstOrCreate({
      user_id: req.user.id,
      emoji: body.emoji,
    });
    const post = await this.postService.update(id, {
      ...body,
      category: category.id
    });

    this.transportService.send('post:updated', {
      id: req.user.id,
      data: { post },
    });

    return post;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param() params, @Request() req) {
    return await this.postService.delete(req.user.id, params.id);
  }
}
