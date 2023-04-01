import { UserService } from '@domain/user/user.service';
import { Command, CommandRunner } from 'nest-commander';
import { TimezoneService } from '@shared/services/timezone.service';

@Command({ name: 'timezone', description: 'Add timezone to users' })
export class TimezoneCommand extends CommandRunner {
  constructor(
    private readonly userService: UserService,
  ) {
    super()
  }

  async run(): Promise<void> {
    const users = await this.userService.find({
      timezone: { $exists: false },
      country_info: { $exists: true }
    });
    for (const user of users) {
      const city = user.get('country_info').country_info.capital;
      await user.updateOne({
        timezone: TimezoneService.fromCity(city),
        $unset: { country_info: 1 },
      }, { strict: false });
    }
    process.exit();
  }
}
