<template>
    <section class="hero">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    Purchase
                </h1>
                <h2 class="subtitle">
                    thanks for stay with us
                </h2>
                <section>
                    <div class="columns">
                        <div class="column is-three-fifths">
                            <div class="card">
                                <header class="card-header">
                                    <p class="card-header-title">
                                        New Purchase
                                    </p>
                                </header>

                                <div class="card-content">
                                    <div class="content">
                                        <b-table
                                                :data="food_data"
                                                bordered
                                                striped
                                                narrowed
                                                hoverable
                                                :selected.sync="selected"
                                        >

                                            <template slot-scope="props">
                                                <b-table-column  label="ID" width="40" >
                                                    <b-button @click="remove_food(props)" size="is-small" type="is-danger">-</b-button>

                                                </b-table-column>

                                                <b-table-column field="name" label="Name">
                                                    {{ props.row.name }}
                                                </b-table-column>


                                                <b-table-column  label="qty" centered>
                                                  {{ props.row.qty }}
                                                </b-table-column>

                                                <b-table-column field="p_total" label="Total">
                                                    {{props.row.p_total}}
                                                </b-table-column>
                                            </template>

                                            <template slot="empty">
                                                <section class="section">
                                                    <div class="content has-text-grey has-text-centered">
                                                        <p>
                                                            <b-icon
                                                                    icon="emoticon-sad"
                                                                    size="is-large">
                                                            </b-icon>
                                                        </p>
                                                        <p>Nothing here.</p>
                                                    </div>
                                                </section>
                                            </template>
                                        </b-table>
                                    </div>
                                </div>
                                <footer class="card-footer">
                                    <a href="#" class="card-footer-item">Total: <b>{{total}}</b><b>৳</b></a>
                                    <a href="#" class="card-footer-item">
                                        <b-field label="Discount">
                                            <b-input v-on:input="change_qty" v-model="purchase.discount"></b-input>
                                        </b-field>

                                    </a>

                                </footer>
                            </div>
                        </div>

                        <div class="column is-half">
                            <div class="card" >
                                <header class="card-header">
                                    <p class="card-header-title">
                                        Select Item
                                    </p>
                                </header>
                                <div class="card-content" style="">
                                    <form @submit.prevent="cart_update" style="width: 100%">
                                        <b-field  label="Name">
                                            <b-input required v-model="purchase_data.name"></b-input>
                                        </b-field>
                                        <b-field label="qty">
                                            <b-input required v-model="purchase_data.qty"></b-input>
                                        </b-field>
                                        <b-field label="Total">
                                            <b-input required v-model="purchase_data.p_total"></b-input>
                                        </b-field>
                                        <input class="button is-link" type="submit" value="Add">
                                    </form>
                                </div>
                                <footer class="card-footer">
                                    <a href="#" class="card-footer-item">
                                        <b-field label="Cash">
                                            <b-input v-model="purchase.cash"></b-input>
                                        </b-field>

                                    </a>
                                    <a @click="save_invoice" class="card-footer-item save_btn">
                                        Save
                                    </a>
                                </footer>
                            </div>

                        </div>

                    </div>
                </section>
            </div>
        </div>
    </section>
</template>

<script>
    var remote = require('electron').remote;
    import path from 'path';
    var fs = remote.require('fs');
    const os = require("os");
    export default {
        name: "pos",
        components:{},
        data() {
            return {
                newCustomer:false,
                data:[],
                keepFirst: false,
                openOnFocus: false,
                name: '',
                selected_customer: null,

                selected:null,
                food_data:[],
                purchase:{
                    total:0,
                    discount:0,
                    cash:0
                },
                purchase_data:{
                  name:"",
                  qty:0,
                    p_total:0
                },
                activeTab: 0,
                showBooks: false,
                categories:null,


            }
        },
        computed: {
            total () {
                var ttl=0;
                for(var i=0;i<this.food_data.length;i++){
                    ttl+= parseFloat(this.food_data[i].p_total);
                }
                var m_ttl= ttl-(ttl*this.purchase.discount)/100;
                this.purchase.total=m_ttl.toFixed(2);
                return m_ttl.toFixed(2);
            },
            filteredDataObj() {
                return this.data.filter((option) => {
                    //console.log(option)
                    return option.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.name.toLowerCase()) >= 0
                })
            }
        },
        mounted(){

        },
        created() {
            let win = remote.getCurrentWebContents()
            //

            console.log(win.getPrinters())
            //win.webContents.print();

            this.$db('customers').where('sts',1).then(rows=>{
                this.data=rows;
            })


        },
        methods:{
            cart_update(){
                this.food_data.push(this.purchase_data);
                this.purchase_data={
                    name:"",
                    qty:0,
                    p_total:0
                };
            },
            remove_food(food){
                this.food_data.splice(food.index, 1);
            },
            change_qty(){
                this.selected=null;
                this.food_data.push({});
                this.food_data.pop();
            },
            save_invoice(){
                //this.$MyPrinter.SendPrintPDF('/invoice/1','PDF');
                this.$db('purchases')
                    .insert({
                        date_time:new Date(),
                        total:this.purchase.total,
                        discount:this.purchase.discount,
                        cash:this.purchase.cash,

                    })
                    .then(res=>{
                        var purchase_id=res[0];
                        const purchase_deatils = this.food_data.map(field =>(
                            {
                                purchase_id:purchase_id,
                                name:field.name,
                                qty:field.qty,
                                total:field.p_total

                            }
                        ));

                        this.$db('purchase_details')
                            .insert(purchase_deatils)
                            .then(res=>{
                                this.purchase={
                                    customer:null,
                                    total:0,
                                    discount:0,
                                    cash:0
                                };
                                this.food_data=[];

                                this.$dialog.confirm({
                                    message: 'Do you want to leave this page?',
                                    onConfirm: () => {
                                        this.$router.push({path:'/'})
                                    }
                                })
                            })
                            .catch(error => {
                                console.log(error)
                                this.$toast.open({
                                    duration: 5000,
                                    message: `Something's not good, Error to Add customer`,
                                    type: 'is-danger'
                                });
                                this.$MyLogger.write_log(error)
                            })
                    })
                    .catch(err=>{
                        this.$MyLogger.write_log(err)
                    })
                console.log(this.purchase)

            }
        }
    }
</script>

<style scoped>
    .card-content{
        height: 400px;
        overflow-y: auto;
    }
    .save_btn{
        padding: 30px;
        background: red;
        color: #e8eef7;
        font-size: 24px;
        font-weight: bold
    }
    .save_btn:hover{
        background: #246722;
        color: white;
        font-size: 24px;
        font-weight: bold
    }
</style>
