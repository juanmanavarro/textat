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
  STOP   = 'stop',
};
export enum Commands {
  HELP  = 'help',
  AYUDA = 'ayuda',
};
export const REPEAT_PARAMETERS = {
  'y' : 'y',
  'mo': 'M',
  'd' : 'd',
  'h' : 'h',
  'm' : 'm',
};
