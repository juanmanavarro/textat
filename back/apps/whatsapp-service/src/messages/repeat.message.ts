import { FormatService } from "../services/format.service";

export const repeatMessage = [
  `${FormatService.bold('/repeat y')} to be repeated every year`,
  `${FormatService.bold('/repeat mo')} to be repeated every month`,
  `${FormatService.bold('/repeat d')} to be repeated every day`,
  `${FormatService.bold('/repeat h')} to be repeated every hour`,
  `${FormatService.bold('/repeat m')} to be repeated every minute`,
].join('\n');
