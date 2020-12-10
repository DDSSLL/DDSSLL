<template>
    <div class="main">
        {{ name }}
    </div>
</template>

<script>
    export default{
        name:"Status",
        data(){
            return{
                name:"DV4000 Status Page"
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .main{
        width: 100%;
        height:100%;
    }
</style>
