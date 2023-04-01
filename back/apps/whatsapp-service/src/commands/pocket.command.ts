import { Injectable } from "@nestjs/common";
import { __ } from "@squareboat/nestjs-localization";
import { SenderService } from "../services/sender.service";

@Injectable()
export class PocketCommand {
  constructor(
    private readonly senderService: SenderService,
  ) {}

  async execute(user = null, message = null) {
    this.senderService.textToUser(user.id, [
      'Access your TextPocket here:',
      '',
      `${process.env.WEBAPP_HOST}`
    ]);
  }
}
