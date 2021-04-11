import Vue from 'vue'
import App from './App'
import store from '@/store/index.js'
import '@/utils/filter'
import '@/utils/prototype'

import Modal from '@/components/modal'
Vue.component('Modal', Modal)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
