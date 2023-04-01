import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { UserService } from '@domain/user/user.service';
import { Cache } from 'cache-manager';
import { HasherService } from '@shared/services/hasher.service';

@Injectable()
export class ChangePasswordConversation {
  user;

  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  setUser(user) {
    this.user = user;
  }

  steps() {
    return [
      {
        message: {
          body: [
            [
              `OK :username. Let's change the password. Type your current password`,
              { username: this.user.username }
            ]
          ],
        },
        data: 'oldPassword',
        validation: oldPassword => {
          return HasherService.compare(oldPassword, this.user.password);
        },
        validationMessage: { body: 'Current password is not correct' },
      },
      {
        message: {
          body: `Now type your new password`,
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
            'Password changed! 🙂',
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
    });

    this.cacheManager.del(user.whatsapp_id);
  }
}
