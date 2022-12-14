import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'normalize.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import { postRequest } from '@/utils/api';
import { putRequest } from '@/utils/api';
import { getRequest } from '@/utils/api';
import { deleteRequest } from '@/utils/api';
import { initMenu } from './utils/menus';
import { downloadRequest } from '@/utils/download';
import 'font-awesome/css/font-awesome.css';

Vue.use(ElementUI);
Vue.config.productionTip = false;

Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest;

// 注册全局前置守卫
router.beforeEach((to, from, next) => {
  if (window.sessionStorage.getItem('tokenStr')) {
    initMenu(router, store);
    if (!window.sessionStorage.getItem('user')) {
      return getRequest('/admin/info').then((resp) => {
        if (resp) {
          window.sessionStorage.setItem('user', JSON.stringify(resp));
          next();
        }
      });
    }
    next();
  } else {
    if (to.path === '/') {
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
