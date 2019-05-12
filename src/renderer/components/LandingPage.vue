<template>
  <div>
    <section  class="hero">
      <div class="hero-body">
        <div class="container">
          <h2 class="subtitle">
            Today Information
          </h2>
          <section>
            <nav class="level">
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Sale</p>
                  <p class="title">3,456</p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Purchase</p>
                  <p class="title">123</p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Expense</p>
                  <p class="title">456K</p>
                </div>
              </div>
            </nav>
          </section>
        </div>
      </div>
    </section>
    <section  class="hero">
      <div class="hero-body">
        <div class="container">
          <h2 class="subtitle">
            Today Sales
          </h2>
          <section>
            <TodaySale :from_dt="from_date"></TodaySale>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { remote } from 'electron';
  var fs = require('fs');
  import path from 'path';
  import TodaySale from './report/sale_report'
  export default {
    name: 'landing-page',
    components: { TodaySale },

    data(){
      const today = new Date();
      return{
        from_date:new Date(today.getTime() - (24*60*60*1000)),
        filepath : path.join(remote.app.getPath('userData'), '/install.mk'),
        DBpath : path.join(remote.app.getPath('userData'), '/data.db'),
        first_run:false,
        tests:null,
        error:null
      }
    },
    created(){
      fs.access(this.filepath, fs.F_OK, (err) => {
                if (err) {

                  fs.unlink(this.DBpath, (err) => {
                    if (err){
                      this.$MyLogger.write_log(err);
                      this.$MyLogger.write_log('unable to delete old DB');

                    }else{
                      this.$MyLogger.write_log('old DB was deleted');
                    }

                  });


                  this.$MyLogger.write_log(err);
                  this.$router.push({name:'install'});
                  this.first_run=true;
                }});


    },
    methods: {
      open () {
        this.$db("test").insert({
          name:"munna"
        }).then((res) => {
          console.log(res)
          this.$db('test')
          .then(rows =>{
            this.tests=rows;
            console.log(rows)
          })
        }).catch((error)=>{
          console.log(error)
         // this.error=error;
        });
        this.error=remote.app.getPath('userData');
        //this.$electron.shell.openExternal(link)
      }
    }
  }
</script>
