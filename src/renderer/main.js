import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import db from './datastore';
import MyLog from './logger';
import MyImage from './image';
import MyPrinter from './MyPrinter';
import SysCtrl from './SystemControl';

import { remote } from 'electron';
var fs = require('fs');
import path from 'path';

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy,{
  defaultIconPack: 'fas',
});


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.SystemControl=Vue.prototype.$SystemControl = new SysCtrl();
Vue.RemoteServer=Vue.prototype.$RemoteServer = "http://api.gotisoft.com/";
Vue.MyPrinter=Vue.prototype.$MyPrinter = new MyPrinter();
Vue.MyImage=Vue.prototype.$MyImage = new MyImage();
Vue.MyLogger=Vue.prototype.$MyLogger = new MyLog();
Vue.db=Vue.prototype.$db = db;
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false



router.beforeEach((to, from, next) => {
  var exp=Vue.SystemControl.check_expiry();
  if(exp){
    next({name:"login"})
  }else{
    next();
  }
})

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
