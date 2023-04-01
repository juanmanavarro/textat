export default {
  "!mañana a las 12 #hola": {
    tags: ['hola'],
    comment: null,
    schedule: 'mañana a las 12',
    commands: [],
  },
  "!mañana a las 12 #hola /voz this is a comment": {
    tags: ['hola'],
    comment: 'this is a comment',
    schedule: 'mañana a las 12',
    commands: ['voz'],
  },
  "this is a /voz comment !mañana a las 12 #hola": {
    tags: ['hola'],
    comment: 'this is a comment',
    schedule: 'mañana a las 12',
    commands: ['voz'],
  },
  "/voz": {
    tags: [],
    comment: null,
    schedule: null,
    commands: ['voz'],
  },
  "#hola": {
    tags: ['hola'],
    comment: null,
    schedule: null,
    commands: [],
  },
  "!mañana a las 12": {
    tags: [],
    comment: null,
    schedule: 'mañana a las 12',
    commands: [],
  },
}
