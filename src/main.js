import Vue from 'vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from './App.vue';
import store from './store/store';
import vSelect from 'vue-select'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-select/dist/vue-select.css';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

Vue.component('v-select', vSelect)

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');