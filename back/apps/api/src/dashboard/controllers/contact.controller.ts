import { Body, Controller, Put, Param, Res, HttpStatus } from '@nestjs/common';
import { ContactService } from '@domain/contact/contact.service';
import { Response } from 'express';
import { TransportService } from '@transport/transport';

@Controller('dashboard/contacts')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly transportService: TransportService,
  ) {}

  @Put('/:id')
  async answer(@Param() { id }, @Body() body, @Res() res: Response) {
    const contact = await this.contactService.update(id, {
      ...body,
      answered_at: new Date,
    });

    this.transportService.send('contact:answered', { contact });

    return res.status(HttpStatus.OK).json({ contact });
  }
}
