import parsePhoneNumber from 'libphonenumber-js';

export default {
  install: (app) => {
    app.config.globalProperties.$formatter = {
      phone: (number) => {
        if ( !number ) return '-';
        return parsePhoneNumber(`+${number}`).formatInternational();
      },
    };
  }
}
