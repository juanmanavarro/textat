import { Injectable } from '@nestjs/common';
import { ErrorHandlerService } from '@shared/services/error-handler.service';
import { Configuration, OpenAIApi } from 'openai';

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
        prompt: `Vamos a parsear frases. La respuesta debe de ser un JSON valido con las siguientes propiedades:
          temp: la parte de la frase que se refiere al tiempo, es decir, la indicacion temporal de la frase
          rest: la parte restante de la frase. Lo que queda al extraer la indicacion temporal de la frase original
          frase: "tengo dentista mañana a las 10"
          respuesta: { "temp": "mañana a las 10", "rest": "tengo dentista" }
          frase: "ayer cene con mi amigo por la noche"
          respuesta: { "temp": "ayer por la noche", "rest": "cene con mi amigo" }
          frase: "${message}"
          respuesta:`,
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
