<template>
    <div>
        <login></login>
    </div>
</template>

<script>
    import login from './login'
    var dns = require("dns");
    export default {
        name: "license",
        components:{login},
        data() {
            return {

            }
        },
        created() {

            this.$parent.$data.install=false;
            console.log(this.$parent.$data)
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>
