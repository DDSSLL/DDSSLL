<template>
  <div class="hello">
    <img alt="Vue logo" src="../../assets/logo.png">
    <div>
      <mt-button type="primary" @click="testMint">Mint-UI</mt-button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'HelloWorld',
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
