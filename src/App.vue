<template>
  <div id="app">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <button @click="handleClick">getDeviceInfo</button>
    <button @click="handleClickInfo">alertInfo</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import exec from './hybrid/index.js'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  methods: {
    handleClick() {
      console.log('hello in click')
      exec(function (data) {
        console.log(JSON.stringify(data))
      }, function () {
        console.log('error message')
      }, 'hybrid.device', 'getDeviceInfo', ["hello world"])
    },
    handleClickInfo () {
      console.log('in click info')
      exec(function (data) {
        console.log(JSON.stringify(data))
      }, function (err) {
        console.log(err)
      }, 'hybrid.notification', 'alert', ["title", "Hello world alert"])
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
