<template>
    <section  class="hero">
        <div>
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
        </div>
        <div class="hero-body">
            <div class="container">
                <h1 class="title">
                    Welcome to <b style="color: royalblue">Goti-Restaurant</b>
                </h1>
                <h2 class="subtitle">
                   Setup Primary Information
                </h2>
                <div>
                    <progress class="progress is-primary" :value="progress" max="100">15%</progress>
                </div>
                <RestaurentInfo v-if="!restaurant_info"></RestaurentInfo>
                <UserInfo v-if="!user_info&&restaurant_info"></UserInfo>
            </div>
        </div>
        <router-link to="/">Home</router-link>
    </section>
</template>

<script>
    import RestaurentInfo from './install/restaurant_info';
    import UserInfo from './install/user_info';
    export default {
        name: "install",
        components:{
            RestaurentInfo,
            UserInfo
        },
        data(){
            return{
                errors:[

                ],
                restaurant_info:false,
                user_info:false,
                progress:0,
            }
        },
        created(){

            this.$parent.showNav=false;
            //create food category
            this.$db.schema.createTable('food_category', (table) => {
                table.increments('id');
                table.string('category_name');
                table.string('sts').defaultTo(1);
            })
            .then((res) => {
                this.progress+=10;
                this.$MyLogger.write_log("create category")
            })
            .catch(err=>{
                this.$MyLogger.write_log("can't create category")
            });

            //create food_menu
            this.$db.schema.createTable('foods', (table) => {
                table.increments('id');
                table.string('name');
                table.string('cat_id');
                table.string('price');
                table.string('unit');
                table.string('pic');
                table.string('sts').defaultTo(1);

            })
            .then((res) => {
                this.progress+=10;
            })
            .catch(err=>{
                this.$MyLogger.write_log("can't create food_menu")
            });

            //create set-menu
            this.$db.schema.createTable('set_menu', (table) => {
                table.increments('id');
                table.string('name');
                table.string('price');
                table.string('discount');
                table.string('pic');
                table.string('sts').defaultTo(1);

            })
            .then((res) => {
                this.progress+=10;
            })
            .catch(err=>{
                this.$MyLogger.write_log("can't create set-menu")
            });

            //create set-menu-details
            this.$db.schema.createTable('set_menu_details', (table) => {
                table.increments('id');
                table.string('set_menu_id');
                table.string('qty');
                table.string('food_id');
                table.string('sts').defaultTo(1);

            })
            .then((res) => {
                this.progress+=10;
            })
            .catch(err=>{
                this.$MyLogger.write_log("can't create set-menu-details")
            });

            //create purchases
            this.$db.schema.createTable('purchases', (table) => {
                table.increments('id');
                table.dateTime('date_time');
                table.string('vendor_id');
                table.string('total');
                table.string('cash');
                table.string('discount');
                table.string('sts').defaultTo(1);

            })
            .then((res) => {
                this.progress+=10;
            })
            .catch(err=>{
                this.$MyLogger.write_log("can't create purchases")
            });

            //create purchases_details
            this.$db.schema.createTable('purchase_details', (table) => {
                table.increments('id');
                table.string('purchase_id');
                table.string('name');
                table.string('qty');
                table.string('total');
                table.string('sts').defaultTo(1);

            })
            .then((res) => {
                this.progress+=10;
            })
            .catch(err=>{
                this.$MyLogger.write_log("can't create purchase details")
            });

            //create expenses
            this.$db.schema.createTable('expenses', (table) => {
                table.increments('id');
                table.dateTime('date_time');
                table.string('name');
                table.string('total');
                table.string('sts').defaultTo(1);

            })
                .then((res) => {
                    this.progress+=10;
                })
                .catch(err=>{
                    this.$MyLogger.write_log("can't create expenses")
                });

            //create Customer
            this.$db.schema.createTable('customers', (table) => {
                table.increments('id');
                table.string('name');
                table.string('mobile');
                table.string('address');
                table.string('birth_date');
                table.string('sts').defaultTo(1);

            })
                .then((res) => {
                    this.progress+=5;
                })
                .catch(err=>{
                    this.$MyLogger.write_log("can't create sales")
                });
            //create sale
            this.$db.schema.createTable('sales', (table) => {
                table.increments('id');
                table.string('customer_id');
                table.dateTime('date_time');
                table.string('gross_total');
                table.string('discount');
                table.string('net_total');
                table.string('cash');
                table.string('sts').defaultTo(1);

            })
            .then((res) => {
                this.progress+=5;
            })
            .catch(err=>{
                this.$MyLogger.write_log("can't create sales")
            });
            //create sale details
            this.$db.schema.createTable('sales_details', (table) => {
                table.increments('id');
                table.string('sale_id');
                table.string('type');
                table.string('food_id');
                table.string('menu_id');
                table.string('qty');
                table.string('price');
                table.string('total');
                table.string('sts').defaultTo(1);

            })
            .then((res) => {
                this.progress+=10;
            })
            .catch(err=>{
                this.$MyLogger.write_log("can't create sales")
            });
        }
    }
</script>

<style scoped>

</style>
