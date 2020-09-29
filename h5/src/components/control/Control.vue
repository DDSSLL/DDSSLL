<template>
    <div class="control">
        <Device></Device>
    </div>
</template>

<script>
    import Device from '../basic/Device';
    export default {
        name: "Control",
        data(){
            return{}
        },
        components: {
            Device
        }
    }
</script>

<style scoped>
    .control{
        margin-top: 60px;
    }
</style>