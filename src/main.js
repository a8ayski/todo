import Vue from 'vue';
import App from './components/App.vue';
import store from './store/index.js';
import router from './router/index.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
