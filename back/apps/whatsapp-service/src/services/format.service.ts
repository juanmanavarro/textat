import { Injectable } from '@nestjs/common';

@Injectable()
export class FormatService {
  static code(string: string): string {
    return `\`\`\`${string}\`\`\``;
  }

  static bold(string: string): string {
    return `*${string}*`;
  }

  static italic(string: string): string {
    return `_${string}_`;
  }

  static command(string: string, bold = false): string {
    const command = `/${string}`;
    return bold ? FormatService.bold(command) : command;
  }
}
