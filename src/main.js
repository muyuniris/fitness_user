import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/css/resize.css';
import Vant from 'vant';
import 'vant/lib/index.css';
import { Lazyload } from 'vant';

Vue.use(Vant);
Vue.use(Lazyload);



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
