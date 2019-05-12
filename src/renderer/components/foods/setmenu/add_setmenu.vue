<template>
    <section class="hero">
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    New Set-Menu
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
                                        Menu
                                    </p>
                                </header>

                                <div class="card-content">
                                    <div class="content">
                                        <div class="columns">
                                            <div class="column">
                                                <b-field label="menu Name">
                                                        <b-input v-model="sale.name"></b-input>
                                                </b-field>
                                            </div>
                                            <div class="column">
                                                <b-field class="file">
                                                    <b-upload v-model="sale.file" accept="image/*">
                                                        <a class="button is-primary">
                                                            <b-icon icon="upload"></b-icon>
                                                            <span>Click to upload</span>
                                                        </a>
                                                    </b-upload>
                                                    <span class="file-name" v-if="sale.file">
                                                        {{ sale.file.name }}
                                                    </span>
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
                                    <a href="#" class="card-footer-item">Total: <b>{{total}}</b><b>৳</b></a>
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

                                    </b-tabs>
                                </div>
                                <footer class="card-footer">
                                    <a href="#" class="card-footer-item">


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
    import cat_foods from '../../pos/cat_foods'
    export default {
        name: "pos",
        components:{cat_foods},
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
                sale:{
                    name:null,
                    total:0,
                    discount:0,
                    cash:0,
                    file:null,
                    img:null
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
                    ttl+= this.food_data[i].qty*this.food_data[i].price
                }
                var m_ttl= ttl-(ttl*this.sale.discount)/100;
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
        },
        created() {
            let win = remote.getCurrentWebContents()
            //
            //win.webContents.print();

            this.$db('customers').where('sts',1).then(rows=>{
                this.data=rows;
            })


        },
        methods:{
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
                        if (this.food_data[i].id === food.id) {

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
                        console.log(22)
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
                var sl;
                this.$db('set_menu')
                    .where({sts: '1'})
                    .orderBy('id','DESC')
                    .then(rows=>{
                        console.log(rows[0]['id'])
                        if(this.sale.file.path!==undefined){
                            if(rows[0]['id']==undefined){
                                sl=1;
                            }else{
                                sl=rows[0]['id']+1;
                            }
                            console.log(sl)
                            var menu_pic=this.$MyImage.save_image(this.sale.file.path,'set_menu_'+sl,this.sale.file.type);

                        }

                        this.$db('set_menu')
                            .insert({
                                name:this.sale.name,
                                price:this.sale.total,
                                discount:this.sale.discount,
                                pic:menu_pic

                            })
                            .then(res=>{
                                var menu_id=res[0];
                                const menu_deatils = this.food_data.map(field =>(
                                    {
                                        set_menu_id:menu_id,
                                        food_id:field.id,
                                        qty:field.qty,
                                        sts:1

                                    }
                                ));

                                this.$db('set_menu_details')
                                    .insert(menu_deatils)
                                    .then(res=>{
                                        this.sale={
                                            name:null,
                                            total:0,
                                            discount:0,
                                            cash:0
                                        };
                                        this.food_data=[];

                                        this.$dialog.confirm({
                                            message: 'Do you want to go home?',
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
                    })



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
