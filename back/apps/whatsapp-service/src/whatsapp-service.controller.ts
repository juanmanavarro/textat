import { Body, Controller, Get, Post, Request, Response, HttpStatus } from '@nestjs/common';
import { UserService } from '@domain/user/user.service';
import { NotificationService } from './services/notification.service';
import { WhatsappService } from './whatsapp.service';
import { LogsService } from '@shared/services/logs.service';
import { HasherService } from '@shared/services/hasher.service';
import { TranslatorService } from './services/translator.service';
import { SenderService } from './services/sender.service';
import { FormatService } from './services/format.service';
var DetectLanguage = require('detectlanguage');

@Controller('whatsapp')
export class WhatsappServiceController {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly whatsappService: WhatsappService,
    private readonly logsService: LogsService,
    private readonly translatorService: TranslatorService,
    private readonly senderService: SenderService,
  ) {}

  @Post('/webhook')
  async webhook(@Body() body, @Response() res) {
    const { message, contact } = this.notificationService.parse(body);
    if ( !message || !contact ) return res.sendStatus(HttpStatus.OK);

    this.logsService.message('whatsapp.webhook', {
      sent: message,
      contact: {
        ...contact,
        wa_id: HasherService.hash(contact.wa_id),
      },
    });

    if ( message.errors ) {
      console.log(message.errors);
      return res.sendStatus(HttpStatus.OK);
    }

    const user = await this.userService.firstOrCreate({
      whatsapp_id: contact.wa_id,
      phone: contact.wa_id,
      name: contact.name,
    });

    if ( user['is_new'] ) {
      const detector = new DetectLanguage(process.env.DETECT_LANGUAGE_API_KEY);
      const lang = await detector.detect(message.text.body);
      user.language = lang[0].language;
      await user.save();
    }

    this.translatorService.setLanguage(user.language);

    if ( user.is_new ) {
      this.senderService.textToUser(
        user.id,
        [[`Welcome to TextAt. You can start scheduling messages now. Try sending "let me know in a minute" or send :command to see what else you can do`, { command: FormatService.command('help', true) }]]
      );
      return;
    }

    await this.whatsappService.listen(user, message);

    return res.sendStatus(HttpStatus.OK);
  }

  @Get('/webhook')
  async verify(@Request() req, @Response() res) {
    const verify_token = process.env.WHATSAPP_VERIFY_TOKEN;

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === verify_token) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }
}
