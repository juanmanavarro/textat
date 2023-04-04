import { Injectable } from '@nestjs/common';
import { ErrorHandlerService } from '@shared/services/error-handler.service';
import { Configuration, OpenAIApi } from 'openai';
import parseTemporalSentence from '../prompts/parse-temporal-sentence';

@Injectable()
export class ParserService {
  static TAG_CHAR = '#';
  static SCHEDULE_CHAR = '@';
  static COMMAND_CHAR = '/';

  private openai;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async parse(message) {
    try {
      const response = await this.openai.createCompletion({
        model: "text-davinci-003",
        prompt: parseTemporalSentence(message),
        temperature: 0,
        max_tokens: 2000,
      });

      const json = response.data.choices[0].text.trim();

      return JSON.parse(json);
    } catch (error) {
      ErrorHandlerService.handle(error);
    }
  }

  static extractEntities(input: string) {
    if ( !input ) return null;

    let schedule = null;
    let tags = [];
    let commands = [];
    let matches = [];

    let tagsMatch = input.match(/#(\w+)($|\s)/g);
    if (tagsMatch) {
      matches = [...tagsMatch];
      tags = tagsMatch.map(tag => tag.substring(1).trim());
    }

    let regex = new RegExp(ParserService.SCHEDULE_CHAR + "(.*?)" + '($|#)');
    let scheduleMatch = input.match(regex);
    if (scheduleMatch) {
      schedule = scheduleMatch[1];
      matches.push(`${ParserService.SCHEDULE_CHAR}${schedule}`);
    }

    let commandMatch = input.match(/\/(\w+)($|\s)/g);
    if (commandMatch) {
      commands = commandMatch.map(c => c.substring(1));
      matches.push(`/${commands}`);
      commands = commands.map(c => c.trim());
    }

    return {
      tags,
      schedule,
      comment: input.replace(new RegExp(matches.join("|"), "g"), "").trim() || null,
      commands,
    };
  }

  static command(message) {
    if ( !message.text?.body?.startsWith('/') ) return {};
    const command = message.text.body.split(' ')[0].slice(1);
    return {
      command,
      rest: message.text.body.replace(`/${command}`, '').trim(),
    };
  }
}
