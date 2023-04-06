import { Injectable } from '@nestjs/common';
var { transform } = require("node-json-transform");

@Injectable()
export class NotificationService {
  parse(notification) {
    const map = {
      list: 'entry.0.changes',
      item: {
        message: 'value.messages.0',
        error: 'value.errors.0',
        contact: 'value.contacts.0',
        from: 'value.messages.0.from'
      },
      operate: [
        {
          run: function (contact) {
            if ( !contact ) return undefined;
            return transform(contact, {
              item: {
                name: 'profile.name',
                wa_id: 'wa_id',
              }
            });
          },
          on: 'contact',
        }
      ],
    }
    const result = transform(notification, map);
    return result[0].message ? result[0] : {};
  }
}
