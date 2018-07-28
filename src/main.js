import Vue from 'vue'
import App from './App.vue'

import hdp from './hybrid/hdp'

window.hdp = hdp

window.console.log("cordova is ===>", typeof cordova)


Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
