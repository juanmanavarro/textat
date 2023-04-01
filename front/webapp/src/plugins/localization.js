// https://vue-i18n.intlify.dev/guide/essentials/syntax.html#literal-interpolation

export default {
  install: (app) => {
    app.config.globalProperties.$l = (string, params = {}) => {
      return app.config.globalProperties.$t(string, params);
    };
    app.provide('$l', app.config.globalProperties.$l);
  }
};
