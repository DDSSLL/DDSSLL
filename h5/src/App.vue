<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div>
      <mt-button type="primary" @click="testMint">Mint-UI</mt-button>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods:{
      testMint(){
          this.$toast({
              message: '操作成功',
              iconClass: 'icon icon-success'
          });
      }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
