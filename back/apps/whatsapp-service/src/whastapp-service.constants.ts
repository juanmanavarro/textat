export enum MessageType {
  AUDIO    = 'audio',
  IMAGE    = 'image',
  VIDEO    = 'video',
  VCARD    = 'vcard',
  DOCUMENT = 'document',
  LOCATION = 'location',
  LINK     = 'link',
  TEXT     = 'text',
  UNKNOWN  = 'unknown',
  REACTION = 'reaction',
};
export enum InlineCommands {
  REPEAT = 'repeat',
  REPITE = 'repite',
  STOP   = 'stop',
};
export enum Commands {
  HELP  = 'help',
  AYUDA = 'ayuda',
};
export const REPEAT_PARAMETERS = {
  'y' : 'year',
  'mo': 'month',
  'w' : 'week',
  'd' : 'day',
  'h' : 'hour',
  'm' : 'minute',
};
