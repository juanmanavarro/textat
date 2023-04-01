import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { UserService } from '@domain/user/user.service';
import { Cache } from 'cache-manager';
import { __ } from "@squareboat/nestjs-localization";

@Injectable()
export class RecoverPasswordConversation {
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
          body: `Bien ${this.user.username}. Vamos a recuperar tu cuenta. Escribe la nueva contraseña`,
        },
        data: 'password',
        validation: password => {
          return password.length >= 8;
        },
        validationMessage: { body: 'La contraseña debe tener al menos 8 caracteres' },
      },
      {
        message: {
          body: [
            'Password changed! 🙂',
            '',
            'Access your TextPocket here:',
            '',
            `${process.env.WEBAPP_HOST}`
          ].join('\n'),
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
