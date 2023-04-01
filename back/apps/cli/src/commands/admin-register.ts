import { AdminService } from '@domain/user/admin.service';
import { Command, CommandRunner, Option } from 'nest-commander';

@Command({ name: 'admin', description: 'Register an admin in the dashboard' })
export class AdminRegisterCommand extends CommandRunner {
  constructor(
    private readonly adminService: AdminService,
  ) {
    super()
  }

  @Option({
    flags: '-e, --email [email]',
    description: 'The admin email',
  })
  parseEmail(val: string): string {
    return val;
  }

  @Option({
    flags: '-p, --password [password]',
    description: 'The admin password',
  })
  parsePassword(val: string): string {
    return val;
  }

  async run(passedParam: string[], options): Promise<void> {
    await this.adminService.firstOrCreate(options);
    process.exit();
  }
}
