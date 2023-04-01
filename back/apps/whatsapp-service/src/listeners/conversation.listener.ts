import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { RegisterConversation } from '../conversations/register.conversation';
import { SenderService } from "../services/sender.service";
import { ChangePasswordConversation } from "../conversations/change-password.conversation";
import { Cache } from 'cache-manager';
import { RecoverPasswordConversation } from "../conversations/recover-password.conversation";

@Injectable()
export class ConversationListener {
  private conversation = null;

  constructor(
    private readonly registerConversation: RegisterConversation,
    private readonly changePasswordConversation: ChangePasswordConversation,
    private readonly recoverPasswordConversation: RecoverPasswordConversation,
    private readonly senderService: SenderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  setConversation(conversation) {
    this.conversation = this[conversation];
    if ( !this.conversation ) throw new Error(`Conversation not found: ${conversation}`);
    return this;
  }

  async handle(user, message) {
    if ( !this.conversation ) throw new Error("Conversation not set");
    this.conversation.setUser(user);
    const conversation: any = await this.cacheManager.get(`${user.whatsapp_id}-conversation`);
    if ( !conversation ) {
      await this.cacheManager.set(`${user.whatsapp_id}-conversation`, {
        conversation: this.conversation
      });
      this.sendMessage(user, this.conversation.steps()[0].message);
      return;
    }

    for (const [index, step] of Object.entries(conversation.conversation.steps())) {
      const currentStep: any = step; // TODO
      if ( currentStep.data && !conversation[currentStep.data] ) {
        if ( !currentStep.validation || await currentStep.validation(message.text.body) ) {
          conversation[currentStep.data] = message.text.body;
        } else {
          if ( !currentStep.validationMessage ) {
            throw new Error("validationMessage is required at step with validation");
          }
          this.sendMessage(user, currentStep.validationMessage);
          return;
        }

        if ( conversation.conversation.steps()[Number(index) + 1] ) {
          this.sendMessage(user, conversation.conversation.steps()[Number(index) + 1].message);
          if ( !conversation.conversation.steps()[Number(index) + 1].data ) break;
        } else break;

        return;
      }
    }

    if ( conversation.conversation.onFinish ) {
      const finished = conversation.conversation.onFinish({
        user_id: user.id,
        contact_id: user.phone,
        data: conversation,
      });

      if ( !finished ) {
        this.sendMessage(user, 'There has been an error. Try again later');
        return;
      }

      await this.cacheManager.del(`${user.whatsapp_id}-conversation`);
    }
  }

  private async sendMessage(user, message) {
    if ( message.body ) message = message.body;

    this.senderService.textToUser(user.id, message);
  }
}
