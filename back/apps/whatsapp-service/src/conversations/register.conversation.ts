import { Injectable } from "@nestjs/common";
import { UserService } from '@domain/user/user.service';
import { HelpMessage } from "../messages/help.message";

@Injectable()
export class RegisterConversation {
  user;

  constructor(
    private readonly userService: UserService,
    private readonly helpMessage: HelpMessage,
  ) {}

  setUser(user) {
    this.user = user;
  }

  steps() {
    return [
      {
        message: {
          body: "Hello, let\'s get started with the registration. Type your username",
        },
        data: 'username',
        validation: async username => {
          return !await this.userService.findOne({ username: username.toLowerCase() })
            && username.length >= 4
            && /^[A-z0-9_]+$/.test(username);
        },
        validationMessage: { body: 'The username is not available. Please choose another one' },
      },
      {
        message: {
          body: 'Good! Now type your password',
        },
        data: 'password',
        validation: password => {
          return password.length >= 8;
        },
        validationMessage: { body: 'The password must be at least 8 characters long' },
      },
      {
        message: {
          body: [
            'Registered! You can start sharing now 🙂',
            '',
            this.helpMessage.body(),
            '',
            'Access your TextPocket here:',
            '',
            `${process.env.WEBAPP_HOST}`
          ],
        }
      },
    ];
  }

  async onFinish(payload) {
    const user = await this.userService.findByIdAndUpdate(payload.user_id, {
      password: payload.data.password,
      username: payload.data.username.trim(),
    });

    if ( !user?.password ) return false;
  }
}
