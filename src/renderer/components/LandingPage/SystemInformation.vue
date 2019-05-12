<template>
  <div style="margin: 2%;text-align: center">
    <div class="title">Information</div>
    <img src="~@/assets/goti-soft.png" alt="">
    <div class="items">
      <div class="item">
        <div class="name">©Copyright: </div>
        <div class="value">GotiSoft - All Right Reserved</div>
      </div>
      <div class="item">
        <div class="name">Address:</div>
        <div class="value">GotiSoft,Rangpur,Bangladesh-5600</div>
      </div>
      <div class="item">
        <div class="name">Mobile:</div>
        <div class="value">+8801717067913</div>
      </div>
      <div class="item">
        <div class="name">Email:</div>
        <div class="value">info@gotisoft.com / engrmunnakhan@gmail.com</div>
      </div>
      <div class="item">
        <div class="name">website:</div>
        <div class="value">www.gotisoft.com</div>
      </div>
      <div class="item">
        <div class="name">Platform:</div>
        <div class="value">{{ platform }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        platform: require('os').platform()
      }
    }
  }
</script>

<style scoped>
  .title {
    color: #888;
    font-size: 18px;
    font-weight: initial;
    letter-spacing: .25px;
    margin-top: 10px;
  }

  .items { margin-top: 8px; }

  .item {
    display: flex;
    margin-bottom: 6px;
  }

  .item .name {
    color: #6a6a6a;
    margin-right: 6px;
  }

  .item .value {
    color: #35495e;
    font-weight: bold;
  }
</style>
