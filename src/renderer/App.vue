<template>
  <div id="app">
    <NavBar v-if="install"></NavBar>
    <router-view></router-view>
  </div>
</template>

<script>
  import NavBar from './components/navbar';
  export default {
    name: 'goti-restaurant',
    components:{NavBar},
    data(){
      return{
        install:true,
        showNav:true,
      }
    },
    created() {
      this.$SystemControl.check_install();

    }
  }
</script>

<style>
  /* CSS */
</style>
