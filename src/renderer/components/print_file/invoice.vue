<template>
    <div id="main">
        <div class="invoice">
            <div class="header">
                <table style="width: 33%;border: none">
                    <thead>
                    <tr>
                        <th style="font-size: 20px;border: none">{{info_data.restaurant_name}}</th>
                    </tr>
                    <tr>
                        <th style="border: none">Address: {{info_data.address}}</th>
                    </tr>
                    <tr>
                        <th style="border: none">Mobile: {{info_data.mobile}}</th>
                    </tr>
                    <tr v-if="customer_data.name!==undefined">
                        <th>Bill To: {{customer_data.name}}</th>
                    </tr>
                    </thead>
                </table>
            </div>
            <div class="customer">
                <table style="width: 33%;float: left;border: none">
                    <thead>
                        <th style="width: 50%!important;">Inv:{{sale_data.id}}</th>
                        <th style="width: 50%!important;">Date:{{new Date(sale_data.date_time).toLocaleDateString()}}</th>
                    </thead>
                </table>
            </div>
            <div class="customer">
                <table  style="width: 33%!important;">
                    <thead>
                    <th>Name</th>
                    <th>Unit</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    </thead>
                    <tbody>
                        <tr v-for="dtl in sale_details_data" >
                            <td>
                                {{dtl.name}}
                            </td>
                            <td>
                                {{dtl.unit}}
                            </td>
                            <td>
                                {{dtl.price}}<span style="padding: 2px">৳</span>
                            </td>
                            <td>
                                {{dtl.qty}}
                            </td>
                            <td>
                                {{dtl.total}} <span style="padding: 2px">৳</span>
                            </td>
                        </tr>
                        <tr v-for="dtl1 in setmenu_details_data" >
                            <td>
                                {{dtl1.name}}
                            </td>
                            <td>
                                set-menu
                            </td>
                            <td>
                                {{dtl1.price}}<span style="padding: 2px">৳</span>
                            </td>
                            <td>
                                {{dtl1.qty}}
                            </td>
                            <td>
                                {{dtl1.total}} <span style="padding: 2px">৳</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
            <div class="customer">
                <table style="width: 33%!important;">
                    <thead>
                        <th>Total</th>
                        <th>Discount</th>
                        <th>Payable</th>
                        <th>Paid</th>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{{sale_data.gross_total}}<span style="padding: 2px">৳</span></td>
                        <td>{{sale_data.discount}}%</td>
                        <td>{{sale_data.net_total}}<span style="padding: 2px">৳</span></td>
                        <td>{{sale_data.cash}}<span style="padding: 2px">৳</span></td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div class="customer">
                <table style="width: 33% !important;border: none">
                    <th style="border: none">
                        <p style="font-size: 12px">Technical Support by www.gotisoft.com - +8801717067913</p>
                    </th>
                </table>
            </div>
        </div>


        <div class="invoice">
            <b-button v-if="view_data" @click="print_inv" type="is-danger">Print</b-button>
        </div>


    </div>
</template>

<script>
    import BButton from "buefy/src/components/button/Button";
    export default {
        name: "invoice",
        components: {BButton},
        data(){
          return{
              sale_details_data:[],
              setmenu_details_data:[],
              sale_data:[],
              customer_data:[],
              info_data:[],
              view_data:false

          }
        },
        computed: {
            total () {
                var ttl=0;
                for(var i=0;i<this.sale_details_data.length;i++){
                    ttl+= parseFloat(this.sale_details_data[i].total)
                }
                return ttl.toFixed(2);
            }
        },
        mounted(){
            if(this.$route.params.id!==undefined){
                var sale_id=this.$route.params.id;
                console.log(sale_id)

                this.$db('info')
                    .then(rows=>{
                        //console.log(rows)
                        this.info_data=rows[0];
                    })
                    .catch(err=>{
                        this.$MyLogger.write_log(err)
                    });




                this.$db('sales')
                    .where('id',sale_id)
                    .then(rows=>{
                        console.log(rows)
                        this.sale_data=rows[0];

                        this.$db('customers')
                            .where('id',rows[0].customer_id)
                            .then(rows1=>{
                                //console.log(rows1)
                                this.customer_data=rows1[0];
                            })
                            .catch(err1=>{
                                this.$MyLogger.write_log(err1)
                            });
                    })
                    .catch(err=>{
                        this.$MyLogger.write_log(err)
                    });

                this.$db('sales_details')
                    .join('foods','sales_details.food_id','foods.id')
                    .where('sales_details.sale_id',sale_id)
                    .then(rows=>{
                        //console.log(rows)
                        this.sale_details_data=rows;
                    })
                    .catch(err=>{
                        this.$MyLogger.write_log(err)
                    })
                this.$db('sales_details')
                    .join('set_menu','sales_details.menu_id','set_menu.id')
                    //.join('set_menu_details','set_menu.id','set_menu_details.set_menu_id')
                    //.join('foods','set_menu_details.food_id','foods.id')
                    .where('sales_details.sale_id',sale_id)
                    .where('sales_details.type','set_menu')
                    .then(rows=>{
                        console.log(rows);
                        this.setmenu_details_data=rows;
                    })
                    .catch(err=>{
                        this.$MyLogger.write_log(err)
                    })

            }
        },
        created() {
            if(this.$route.params.view!==undefined){
                if(this.$route.params.view){
                    this.view_data=true;
                }
            }else{
                this.$MyPrinter.PrintToPrinter();
                this.$parent.showNav=false;
            }


            //
        },
        methods:{
            print_inv(){
                this.$MyPrinter.SendPrint('/invoice/'+this.sale_data.id)
            }
        }
    }
</script>

<style scoped>
    @page A4 {
        margin: 0;
        padding: 0;
    }
    #main{
        box-sizing: border-box;
    }
    .invoice{
        flex: 1 0 35%; /* explanation below */
        margin: 5px;
        height: 100px;
        text-align: left;
    }
    .customer{
        display: flex;
    }
    table{
        width: 100%;
        text-align: center;
    }
    td{
        text-align: center;
        padding: 2px;
    }
    th{
        border-collapse: collapse;
        text-align: center;
        border-bottom: 1px solid black;
        padding: 5px;
    }


</style>
