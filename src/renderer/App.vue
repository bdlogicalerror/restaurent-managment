<template>
  <div id="app">
    <NavBar v-if="showNav"></NavBar>
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
        showNav:true,
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
