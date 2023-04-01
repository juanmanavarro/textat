import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { createI18n } from 'vue-i18n';

import '@ionic/vue/css/core.css';

import { createDeviceDetector } from "next-vue-device-detector";

import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/css/main.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/bootstrap4-light-blue/theme.css';
import './assets/sass/post.scss';
import './assets/sass/ionic.custom.scss';

import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

import date from './plugins/date';
import emitter from './plugins/emitter';
import formatter from './plugins/formatter';
import currency from './plugins/currency';
import localization from './plugins/localization';

import 'https://js.stripe.com/v3/';

import es from '../locales/es.json';
import en from '../locales/en.json';
const i18n = createI18n({
  locale: navigator.language || navigator.userLanguage,
  fallbackLocale: 'en-GB',
  messages: { 'es-ES': es, 'en-GB': en },
});

const app = createApp(App);
app.use(i18n);
app.use(createPinia());
app.use(router);
app.use(emitter);
app.use(formatter);
app.use(date);
app.use(currency);
app.use(localization);
app.use(VueViewer);

const device = createDeviceDetector();
app.use(device);

app.directive('dev', (el) => {
  if ( !import.meta.env.DEV ) el.style.display = 'none';
});

app.config.globalProperties.$env = import.meta.env;
app.provide('$env', import.meta.env);

const config = {
  toast: {
    life: 10000,
  },
};
app.config.globalProperties.$config = config;
app.provide('$config', config);

app.use(IonicVue, {
  mode: 'md',
});

router.isReady().then(() => {
  app.mount('#app');
});
