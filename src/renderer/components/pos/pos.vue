<template>
    <section class="hero">
        <div class="hero-body">
            <div class="container">
                <h1 class="title" v-if="info_data.restaurant_name!==undefined">
                   {{info_data.restaurant_name}}
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
                                        New Order
                                    </p>
                                </header>

                                <div class="card-content">
                                    <div class="content">
                                        <div class="columns">
                                            <div class="column">
                                                <b-field label="Select Customer">
                                                    <b-autocomplete
                                                            v-model="selected_customer"
                                                            placeholder="e.g. Anne"
                                                            :keep-first="keepFirst"
                                                            :open-on-focus="openOnFocus"
                                                            :data="filteredDataObj"
                                                            field="name"
                                                            @select="option => sale.customer = option">
                                                    </b-autocomplete>
                                                </b-field>
                                            </div>
                                            <div class="column">
                                                <b-field label="New Customer">
                                                    <b-button @click="newCustomer=true" type="is-primary">New</b-button>
                                                </b-field>

                                            </div>
                                        </div>

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

                                                <b-table-column field="unit" label="Unit">
                                                    {{ props.row.unit }}
                                                </b-table-column>

                                                <b-table-column  label="qty" centered>
                                                        <b-numberinput size="is-small" v-on:input="change_qty(props.index)" v-model="food_data[props.index].qty">
                                                        </b-numberinput>
                                                </b-table-column>

                                                <b-table-column label="Price">
                                                    {{ props.row.price }}
                                                </b-table-column>
                                                <b-table-column label="Total">
                                                    {{food_data[props.index].price*food_data[props.index].qty }}
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
                                    <a href="#" class="card-footer-item">Total: <b style="font-size: 28px;padding: 5px">{{total}}৳</b></a>
                                    <a href="#" class="card-footer-item">
                                        <b-field label="Discount">
                                            <b-input v-on:input="change_qty" v-model="sale.discount"></b-input>
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
                                <div class="card-content" style="overflow-y: visible">
                                    <b-tabs v-model="activeTab" type="is-boxed">
                                        <b-tab-item v-for="cat in categories" v-bind:key="cat.id" :label="cat.category_name">
                                            <cat_foods @update_cart="cart_update" :category_id="cat.id"></cat_foods>
                                        </b-tab-item>
                                        <b-tab-item  label="Set-Menu" v-bind:key="categories.length+1">
                                            <SetMenu @update_cart_set_menu="cart_update"></SetMenu>
                                        </b-tab-item>

                                    </b-tabs>
                                </div>
                                <footer class="card-footer">
                                    <a href="#" class="card-footer-item">
                                        <b-field label="Cash">
                                            <b-input v-model="sale.cash"></b-input>
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

        <!--Modal for new customer-->
        <b-modal width="40" has-modal-card :active.sync="newCustomer">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">New Customer</p>
                </header>
                <section class="modal-card-body">
                    <NewCustomer me_as_child="true" @customer_added="get_customers"></NewCustomer>
                </section>
            </div>

        </b-modal>
    </section>
</template>

<script>

    import NewCustomer from '../customer/new_customer';
    import cat_foods from './cat_foods';
    import SetMenu from './set_menu';
    var remote = require('electron').remote;
    import path from 'path';
    var fs = remote.require('fs');
    const os = require("os");
    export default {
        name: "pos",
        components:{cat_foods,NewCustomer,SetMenu},
        data() {
            return {
                info_data:{},
                newCustomer:false,
                data:[],
                keepFirst: false,
                openOnFocus: false,
                name: '',
                selected_customer: null,

                selected:null,
                food_data:[],
                sale:{
                    customer:null,
                    total:0,
                    discount:0,
                    cash:0,
                    gross_total:0

                },
                activeTab: 0,
                showBooks: false,
                categories:[],


            }
        },
        computed: {
            total () {
                var ttl=0;
                for(var i=0;i<this.food_data.length;i++){
                   ttl+= this.food_data[i].qty*this.food_data[i].price
                }
                var m_ttl= ttl-(ttl*this.sale.discount)/100;
                this.sale.gross_total=ttl;
                this.sale.total=m_ttl;
                return m_ttl;
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

            this.get_category();

            this.$db('info')
                .then(rows=>{
                    console.log(rows)
                    this.info_data=rows[0];
                })
                .catch(err=>{
                    this.$MyLogger.write_log(err)
                });
        },
        created() {
            let win = remote.getCurrentWebContents()
            //
            const ses = win.session
            console.log(ses.getUserAgent())
            console.log(win.getPrinters())
            //win.webContents.print();



            this.get_customers();


        },
        methods:{
            get_customers(){
                this.newCustomer=false;
                this.$db('customers').where('sts',1).then(rows=>{
                    this.data=rows;
                })
            },
            get_category(){
                this.$db('food_category')
                    .where({sts:1})
                    .then(rows => {
                        this.categories = rows;
                    });
            },
            cart_update(food){
                var found = false;
                if(this.food_data.length>0){
                    for(var i = 0; i < this.food_data.length; i++) {
                        if (this.food_data[i].id === food.id && this.food_data[i].type==food.type) {

                            found=true;
                            break;
                        }
                    }
                    if(found){
                        this.food_data[i].qty++;
                        this.selected=null;
                        var data=this.food_data[i];
                        this.selected=data;
                    }else{
                        this.selected=null;
                        this.food_data.push(food)
                    }
                }else{
                    this.selected=null;
                    this.food_data.push(food)
                }


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
                var customer=this.sale.customer!==null?this.sale.customer.id:0;
                this.$db('sales')
                    .insert({
                        customer_id:customer,
                        date_time:new Date(),
                        net_total:this.sale.total,
                        discount:this.sale.discount,
                        cash:this.sale.cash,
                        gross_total:this.sale.gross_total,

                    })
                    .then(res=>{
                        var sale_id=res[0];
                        const sale_deatils = this.food_data.map(field =>(
                            {
                                sale_id:sale_id,
                                food_id:field.type==undefined?field.id:0,
                                type:field.type==undefined?0:field.type,
                                menu_id:field.menu_id==undefined?0:field.menu_id,
                                qty:field.qty,
                                price:field.price,
                                total:field.price*field.qty,
                                sts:1

                            }
                        ));

                        this.$db('sales_details')
                            .insert(sale_deatils)
                            .then(res=>{
                                this.sale={
                                    customer:null,
                                    total:0,
                                    discount:0,
                                    cash:0
                                };
                                this.food_data=[];

                                this.$dialog.confirm({
                                    message: 'Do you want to Print Invoice?',
                                    onConfirm: () => {
                                        this.$MyPrinter.SendPrint('/invoice/'+sale_id)
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
                console.log(this.sale)

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
