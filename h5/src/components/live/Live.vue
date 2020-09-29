<template>
    <div class="live">
        <Device></Device>
    </div>
</template>

<script>
    import Device from '../basic/Device';
    export default {
        name: "Live",
        data(){
            return{}
        },
        components: {
            Device
        }
    }
</script>

<style scoped>
    .live{
        margin-top: 60px;
    }
</style>