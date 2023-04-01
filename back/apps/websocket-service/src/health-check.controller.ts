import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('hc')
export class HealthCheckController {
  @Get()
  index(@Res() res: Response) {
    return res.sendStatus(HttpStatus.OK);
  }
}
