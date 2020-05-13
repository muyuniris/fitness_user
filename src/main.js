import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/css/resize.css';
import Vant from 'vant';
import 'vant/lib/index.css';
import { Lazyload } from 'vant';
import { Form } from 'vant';
import vueAxios from 'vue-axios';
import http from './utils/http';
import axios from 'axios';




Vue.use(vueAxios, http);
Vue.prototype.$axios = axios;

Vue.use(Vant);
Vue.use(Lazyload);
Vue.use(Form);




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
