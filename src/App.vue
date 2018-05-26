<template>
  <div id="app">
    <HelloWorld msg="Web容器的测试页面"/>
    <div class="wrapper">
      <div class="btn" @click="handleClick">getDeviceInfo</div>
      <div class="btn" @click="handleClickInfo">alertInfo</div>
    </div>
    
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import hdp from './hybrid/hdp.js'

export default {
  name: 'app',
  components: {
    HelloWorld
  },
  methods: {
    handleClick() {
      console.log('hello in click')
      hdp.exec('hybrid.device', 'getDeviceInfo')
          .then((data) => {
            console.log('device data ==> ', data)
          })
          .catch((err) => {
            console.log('device err ==> ', err)
          })
    },
    handleClickInfo () {
      console.log('in click info')
      hdp.exec('hybrid.notification', 'alert', 'title', 'Hello this is alert')
          .then((data) => {
            console.log(data)
          })
          .catch((err) => {
            console.log(err)
          })
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

.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  height: 40px;
  width: 180px;
  margin-bottom: 12px;
  background-color: #ff5777;
}
</style>
