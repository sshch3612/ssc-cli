// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets
import "babel-polyfill";

import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import echarts from "./assets/js/echarts";
import store from "./store";
import filter from "./filter";


import "./assets/css/variable.less";
import "./assets/css/global.less";
// import './util/rem.js'
import moment from "moment";

Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.prototype.$moment = moment;
filter(Vue);

/* eslint-disable no-new */
new Vue({
    store,
    router,
    render: h => h(App),
}).$mount("#app");

// window.addEventListener("beforeunload", function () {
//   console.log('refresh');
//   setObj('store', store.state);
// })
