import { CategoryService } from '@domain/category/category.service';
import { PostService } from '@domain/post/post.service';
import { JwtAuthGuard } from '@domain/user/guards/jwt-auth.guard';
import { Controller, Get, UseGuards, Request, Put, Param, Body, Delete } from '@nestjs/common';
import { TransportService } from '@transport/transport';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly postService: PostService,
    private readonly transportService: TransportService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index(@Request() req) {
    return await this.postService.categories({ user_id: req.user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async edit(@Param() { id }, @Body() body, @Request() req) {
    return await this.categoryService.update({ _id: id }, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param() { id }, @Request() req) {
    // TODO to transaction
    const categoryId = await this.categoryService.delete(id);
    await this.postService.updateMany({ category_id: id }, { category_id: null });

    this.transportService.send('category:deleted', {
      id: req.user.id,
      data: { category_id: id },
    });

    return categoryId;
  }
}
