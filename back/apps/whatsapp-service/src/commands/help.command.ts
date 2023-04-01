import { Injectable } from "@nestjs/common";
import { SenderService } from "../services/sender.service";
import { __ } from "@squareboat/nestjs-localization";
import { HelpMessage } from '../messages/help.message';

@Injectable()
export class HelpCommand {
  constructor(
    private readonly senderService: SenderService,
    private readonly helpMessage: HelpMessage,
  ) {}

  async execute(user = null) {
    this.senderService.textToUser(user.id, this.helpMessage.body());
  }
}
