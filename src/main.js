// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ViewUI from 'view-design'
import App from './App'
import router from './router'
import store from './store'
// import iView from 'view-design'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'

import 'view-design/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import Highlight from '@/plugin/highlight.js'

import 'font-awesome/css/font-awesome.min.css'
import 'github-markdown-css'
import 'highlight.js/styles/atom-one-dark.css'

Vue.use(Highlight)

Vue.use(ViewUI, {
  i18n: (key, value) => i18n.t(key, value)
})
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
