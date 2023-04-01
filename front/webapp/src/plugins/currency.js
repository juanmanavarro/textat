export default {
  install: (app) => {
    app.config.globalProperties.$currency = {
      format: (number) => {
        if ( !number ) return null;
        return (new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }))
          .format(number);
      },
    };
    app.provide('$currency', app.config.globalProperties.$currency);
  }
}
