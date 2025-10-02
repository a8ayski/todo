import Vue from 'vue';
import App from './components/App.vue';
import store from './store/index.js';
import router from './router/index.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/main.css';

import moment from 'moment';
import 'moment/locale/ru';
moment.locale('ru');
window.moment = moment;

import lang from 'element-ui/lib/locale/lang/ru-RU';
import locale from 'element-ui/lib/locale';
locale.use(lang);

Vue.use(ElementUI);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
