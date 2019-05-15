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
                  <p class="title">{{today_report.sale}}<span style="padding: 2px;font-weight: bold">৳</span></p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Purchase</p>
                  <p class="title">{{today_report.purchases}}<span style="padding: 2px;font-weight: bold">৳</span></p>
                </div>
              </div>
              <div class="level-item has-text-centered">
                <div>
                  <p class="heading">Expense</p>
                  <p class="title">{{today_report.expenses}}<span style="padding: 2px;font-weight: bold">৳</span></p>
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
        error:null,

        today_report:{
          sale:0,
          purchases:0,
          expenses:0,
        }
      }
    },
    mounted(){
      if(!this.first_run){
        this.todays_sale();
        this.todays_expenses();
        this.todays_purchase();
      }
    },
    created(){
      console.log(this.$parent.$data);
      this.$parent.$data.install=true;
      /*fs.access(this.filepath, fs.F_OK, (err) => {
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
          console.log(err);
          this.$parent.showNav=false;
          this.$router.push({name:'install'});
          this.first_run=true;

          this.$parent.$data.install=false;

        }
        this.$parent.$data.install=true;
        this.$parent.showNav=true;
        this.first_run=false;
      });*/
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
          })
        }).catch((error)=>{
          console.log(error)
         // this.error=error;
        });
        this.error=remote.app.getPath('userData');
        //this.$electron.shell.openExternal(link)
      },
      todays_sale(){
        this.$db('sales')
                .where('sts', 1)
                .where('date_time', '>=',this.from_date)
                .where('date_time', '<=',new Date())
                .sum({sale:'net_total'})
                .then(data => {
                  this.today_report.sale=data[0].sale;
                })
                .catch((error) => {
                  console.log(error)
                  throw error
                })
      },
      todays_purchase(){
        this.$db('purchases')
                .where('sts', 1)
                .where('date_time', '>=',this.from_date)
                .where('date_time', '<=',new Date())
                .sum({purchases:'total'})
                .then(data => {
                  this.today_report.purchases=data[0].purchases;
                })
                .catch((error) => {
                  console.log(error)
                  throw error
                })
      },
      todays_expenses(){
        this.$db('expenses')
                .where('sts', 1)
                .where('date_time', '>=',this.from_date)
                .where('date_time', '<=',new Date())
                .sum({expenses:'total'})
                .then(data => {
                  this.today_report.expenses=data[0].expenses;
                })
                .catch((error) => {
                  console.log(error)
                  throw error
                })
      }

    }
  }
</script>
